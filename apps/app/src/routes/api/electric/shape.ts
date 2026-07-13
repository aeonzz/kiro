import { prisma } from "@kiro/db";
import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth";

const ELECTRIC_URL = process.env.ELECTRIC_URL ?? "https://api.electric-sql.cloud";

/**
 * Tables the client may sync through this proxy, mapped to the exact columns
 * exposed for each. Every table here must have a `teamId` column so the shape
 * can be scoped to a single team, and every column list must include the
 * table's primary key(s). The client cannot widen this — its `columns` param
 * is ignored.
 */
const TABLE_COLUMNS: Record<string, readonly string[]> = {
  issue: [
    "id",
    "number",
    "title",
    "priority",
    "teamId",
    "stateId",
    "assigneeId",
    "createdAt",
    "updatedAt",
  ],
  issue_label_on_issue: ["issueId", "labelId", "teamId"],
};

/**
 * The only client params forwarded to Electric: the shape-stream protocol
 * params that drive resumption and live mode. Everything else the client
 * sends is dropped; scope (`table`, `columns`, `where`) is set server-side.
 */
const FORWARDED_PARAMS = ["offset", "handle", "live", "cursor", "cache-buster"];

/**
 * Gatekeeper proxy for Electric Cloud shapes.
 *
 * The browser's ShapeStream points at this route instead of Electric Cloud so
 * the source id/secret stay on the server. We authenticate the session, resolve
 * the requested org/team slug to a team the user belongs to, and force a
 * `teamId = ...` where clause before forwarding to Electric — the client only
 * chooses which allow-listed table to read.
 */
async function handleShapeRequest(request: Request): Promise<Response> {
  const sourceId = process.env.ELECTRIC_SOURCE_ID;
  const sourceSecret = process.env.ELECTRIC_SOURCE_SECRET;

  if (!sourceId || !sourceSecret) {
    return new Response("Electric source is not configured", { status: 500 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const table = url.searchParams.get("table");
  const organizationSlug = url.searchParams.get("organization");
  const teamSlug = url.searchParams.get("team");

  const columns = table ? TABLE_COLUMNS[table] : undefined;

  if (!table || !columns) {
    return new Response("Unknown or disallowed table", { status: 400 });
  }

  if (!organizationSlug || !teamSlug) {
    return new Response("Missing organization or team", { status: 400 });
  }

  const team = await prisma.team.findFirst({
    where: {
      slug: teamSlug,
      organization: {
        slug: organizationSlug,
        members: { some: { userId: session.user.id } },
      },
    },
    select: { id: true },
  });

  if (!team) {
    return new Response("Forbidden", { status: 403 });
  }

  const originUrl = new URL(`${ELECTRIC_URL}/v1/shape`);

  for (const key of FORWARDED_PARAMS) {
    const value = url.searchParams.get(key);
    if (value !== null) {
      originUrl.searchParams.set(key, value);
    }
  }

  originUrl.searchParams.set("source_id", sourceId);
  originUrl.searchParams.set("secret", sourceSecret);
  originUrl.searchParams.set("table", table);
  // Quote each column: Postgres lowercases unquoted identifiers, and these
  // are camelCase (e.g. `teamId` would otherwise be read as `teamid`).
  originUrl.searchParams.set(
    "columns",
    columns.map((column) => `"${column}"`).join(",")
  );
  // Positional param rather than string interpolation so the team id can
  // never terminate the quoting inside the shape's where clause.
  originUrl.searchParams.set("where", `"teamId" = $1`);
  originUrl.searchParams.set("params[1]", team.id);

  const response = await fetch(originUrl);

  // Buffer the (bounded) shape response rather than piping the stream through:
  // fetch already decoded any gzip, and forwarding `transfer-encoding: chunked`
  // makes downstream middleware treat this as a long-lived stream.
  const body = await response.arrayBuffer();

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const Route = createFileRoute("/api/electric/shape")({
  server: {
    handlers: {
      GET: ({ request }) => handleShapeRequest(request),
    },
  },
});
