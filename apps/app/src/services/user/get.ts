import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

import { getUserPreferencesService } from "./service";

export const getUserPreferencesFn = createServerFn({ method: "GET" })
  .middleware([loggerMiddleware, authMiddleware])
  .handler(async ({ context }) => {
    return getUserPreferencesService({
      userId: context.session.user.id,
    });
  });
