import authMiddleware from "@/middlewares/auth";
import { createServerFn } from "@tanstack/react-start";

import { getUserPreferencesService } from "./service";

export const getUserPreferencesFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return getUserPreferencesService({
      userId: context.session.user.id,
    });
  });
