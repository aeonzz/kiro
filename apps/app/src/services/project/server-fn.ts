import authMiddleware from "@/middlewares/auth";
import { createServerFn } from "@tanstack/react-start";

import { createProjectSchema, getOrganizationProjectSchema } from "./schema";
import {
  createProjectService,
  getOrganizationProjectsService,
} from "./service";

export const getOrganizationProjectsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getOrganizationProjectSchema)
  .handler(async ({ context, data }) => {
    return getOrganizationProjectsService({
      userId: context.session.user.id,
      organizationSlug: data.slug,
    });
  });

export const createProjectFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(createProjectSchema)
  .handler(async ({ data }) => {
    return createProjectService({
      data,
    });
  });
