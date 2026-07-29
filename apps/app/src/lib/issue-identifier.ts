/**
 * Issue URLs follow Linear's shape: `/{org}/issue/{TEAM-N}/{title-slug}`.
 *
 * Issues are keyed in the DB by `@@unique([teamId, number])`, so `TEAM-N` is
 * the whole identifier — the trailing title slug is cosmetic and never read
 * back, which is why a stale or edited title still resolves.
 *
 * Keep `format` and `parse` together: the issue list/board build identifiers
 * with one and the `$issue` route resolves them with the other.
 */

/** `("DD", 4)` -> `"DD-4"`. */
export function formatIssueIdentifier(teamSlug: string, number: number) {
  return `${teamSlug.toUpperCase()}-${number}`;
}

/** `"DD-4"` -> `{ teamSlug: "DD", number: 4 }`, or `null` if malformed. */
export function parseIssueIdentifier(identifier: string) {
  // Greedy `.+` splits on the *last* hyphen — team slugs may contain one.
  const match = /^(.+)-(\d+)$/.exec(identifier);
  if (!match) return null;
  // Team slugs are stored uppercase (see settings/new-team.tsx and lib/auth.ts),
  // so normalizing here makes the team part of the URL case-insensitive.
  return { teamSlug: match[1].toUpperCase(), number: Number(match[2]) };
}

/**
 * Title -> URL slug. Purely cosmetic, so it never needs to round-trip; it only
 * has to be a non-empty, URL-safe segment.
 */
export function slugifyIssueTitle(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
  return slug || "untitled";
}
