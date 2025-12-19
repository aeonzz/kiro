import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { organizationInputSchema } from "./schema";
import { createOrganizationService } from "./service";

export const createOrganizationFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(organizationInputSchema)
  .handler(async ({ data, context }) => {
    const headers = getRequestHeaders();
    const session = context.session;

    return createOrganizationService({
      data: { ...data, userId: session.user.id },
      headers,
    });
  });
