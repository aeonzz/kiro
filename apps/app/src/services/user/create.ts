import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

import { setUserPreferencesInput } from "./schema";
import { setUserPreferencesService } from "./service";

export const setUserPreferencesFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(setUserPreferencesInput)
  .handler(async ({ data, context }) => {
    return setUserPreferencesService({
      userId: context.session.user.id,
      data,
    });
  });
