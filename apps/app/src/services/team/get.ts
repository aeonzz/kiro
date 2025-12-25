import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

import { getTeamByIdSchema } from "./schema";
import { getTeamByIdService } from "./service";

export const getTeamByIdFn = createServerFn({ method: "GET" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(getTeamByIdSchema)
  .handler(async ({ data }) => {
    return getTeamByIdService({
      slug: data.slug,
      organizationSlug: data.organizationSlug,
    });
  });
