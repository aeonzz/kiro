import { auth } from "@/lib/auth";
import authMiddleware from "@/middlewares/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";

import { applyIssueCrud } from "./service";

/**
 * Returns a fresh PowerSync JWT for the signed-in user, signed by better-auth's
 * JWKS key (verified by the PowerSync instance via /api/auth/jwks). Called by
 * the client connector's `fetchCredentials`; always mints a new token.
 */
export const getPowerSyncTokenFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { token } = await auth.api.getToken({
      headers: getRequestHeaders(),
    });
    return token;
  });

const crudOpSchema = z.object({
  op: z.enum(["PUT", "PATCH", "DELETE"]),
  table: z.string(),
  id: z.string(),
  data: z.record(z.string(), z.unknown()),
});

/**
 * Applies a batch of local PowerSync writes to Postgres. Called by the client
 * connector's `uploadData` with the current CRUD transaction's operations.
 */
export const uploadCrudFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ ops: z.array(crudOpSchema) }))
  .handler(async ({ context, data }) => {
    await applyIssueCrud({
      userId: context.session.user.id,
      ops: data.ops,
    });
  });
