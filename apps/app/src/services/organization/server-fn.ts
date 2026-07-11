import authMiddleware from "@/middlewares/auth";
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
  listUserOrganizationsService,
  updateOrganizationService,
} from "./service";

export const getOrganizationFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getUserOrganizationSchema)
  .handler(async ({ context, data }) => {
    return getOrganizationService({
      userId: context.session.user.id,
      slug: data.slug,
    });
  });

export const createOrganizationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(organizationInputSchema)
  .handler(async ({ data, context }) => {
    const headers = getRequestHeaders();
    const session = context.session;

    return createOrganizationService({
      data: { ...data, userId: session.user.id },
      headers,
    });
  });

export const updateOrganizationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(updateOrganizationSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();

    return updateOrganizationService({
      data,
      headers,
    });
  });

export const listOrganizationsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return listUserOrganizationsService({
      userId: context.session.user.id,
    });
  });
