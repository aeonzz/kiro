import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

import { updateTeamSchema } from "./schema";
import { updateTeamService } from "./service";

export const updateTeamFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(updateTeamSchema)
  .handler(async ({ data }) => {
    return updateTeamService(data);
  });
