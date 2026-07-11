import authMiddleware from "@/middlewares/auth";
import loggerMiddleware from "@/middlewares/logger";
import { createServerFn } from "@tanstack/react-start";

import {
  createWorkflowStateSchema,
  createTeamSchema,
  deleteTeamSchema,
  deleteWorkflowStateSchema,
  getTeamByIdSchema,
  getTeamsSchema,
  reorderWorkflowStatesSchema,
  updateTeamSchema,
  updateWorkflowStateSchema,
} from "./schema";
import {
  createWorkflowStateService,
  createTeamService,
  deleteTeamService,
  deleteWorkflowStateService,
  getTeamByIdService,
  getTeamsService,
  reorderWorkflowStatesService,
  updateTeamService,
  updateWorkflowStateService,
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

export const createWorkflowStateFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(createWorkflowStateSchema)
  .handler(async ({ data }) => {
    return createWorkflowStateService(data);
  });

export const updateWorkflowStateFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(updateWorkflowStateSchema)
  .handler(async ({ data }) => {
    return updateWorkflowStateService(data);
  });

export const deleteWorkflowStateFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(deleteWorkflowStateSchema)
  .handler(async ({ data }) => {
    return deleteWorkflowStateService(data);
  });

export const reorderWorkflowStatesFn = createServerFn({ method: "POST" })
  .middleware([loggerMiddleware, authMiddleware])
  .inputValidator(reorderWorkflowStatesSchema)
  .handler(async ({ data }) => {
    return reorderWorkflowStatesService(data);
  });
