import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import {
  getUserOrganizationSchema,
  organizationInputSchema,
  updateOrganizationSchema,
} from "./schema";
import {
  createOrganizationService,
  getOrganizationService,
  updateOrganizationService,
} from "./service";

export const getOrganizationFn = createServerFn({ method: "GET" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(getUserOrganizationSchema)
  .handler(async ({ context, data }) => {
    return getOrganizationService({
      userId: context.session.user.id,
      slug: data.slug,
    });
  });

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

export const updateOrganizationFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(updateOrganizationSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    return updateOrganizationService({
      data,
      headers,
    });
  });
