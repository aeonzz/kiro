import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

import { createTeamSchema } from "./schema";
import { createTeamService } from "./service";

export const createTeamFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(createTeamSchema)
  .handler(async ({ data, context }) => {
    const session = context.session;
    return createTeamService({
      userId: session.user.id,
      data,
    });
  });
