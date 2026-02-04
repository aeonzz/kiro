import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

import {
  createTeamSchema,
  deleteTeamSchema,
  getTeamByIdSchema,
  getTeamsSchema,
  updateTeamSchema,
} from "./schema";
import {
  createTeamService,
  deleteTeamService,
  getTeamByIdService,
  getTeamsService,
  updateTeamService,
} from "./service";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getTeamByIdFn = createServerFn({ method: "GET" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(getTeamByIdSchema)
  .handler(async ({ data }) => {
    return getTeamByIdService({
      slug: data.slug,
      organizationSlug: data.organizationSlug,
    });
  });

export const getTeamsFn = createServerFn({ method: "GET" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(getTeamsSchema)
  .handler(async ({ data }) => {
    return getTeamsService({
      organizationSlug: data.organizationSlug,
    });
  });

export const createTeamFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(createTeamSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    return createTeamService(data, headers);
  });

export const updateTeamFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(updateTeamSchema)
  .handler(async ({ data }) => {
    return updateTeamService(data);
  });

export const deleteTeamFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(deleteTeamSchema)
  .handler(async ({ data }) => {
    return deleteTeamService(data);
  });
