import * as z from "zod";

const workflowTypeSchema = z.enum([
  "BACKLOG",
  "UNSTARTED",
  "STARTED",
  "COMPLETED",
  "CANCELED",
  "DUPLICATE",
]);

export const createTeamSchema = z.object({
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
});

export type CreateTeamSchemaType = z.infer<typeof createTeamSchema>;

export const getTeamByIdSchema = z.object({
  slug: z.string(),
  organizationSlug: z.string(),
});

export type GetTeamByIdSchemaType = z.infer<typeof getTeamByIdSchema>;

export const updateTeamSchema = z.object({
  id: z.string(),
  payload: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
  }),
});

export type UpdateTeamSchemaType = z.infer<typeof updateTeamSchema>;

export const getTeamsSchema = z.object({
  organizationSlug: z.string(),
});

export type GetTeamsSchemaType = z.infer<typeof getTeamsSchema>;

export const deleteTeamSchema = z.object({
  id: z.string(),
});

export type DeleteTeamSchemaType = z.infer<typeof deleteTeamSchema>;

export const createWorkflowStateSchema = z.object({
  teamId: z.string(),
  name: z.string().min(1).max(32),
  color: z.string().min(1),
  type: workflowTypeSchema,
  description: z.string().max(120).optional(),
  isDefault: z.boolean().optional(),
});

export type CreateWorkflowStateSchemaType = z.infer<
  typeof createWorkflowStateSchema
>;

export const updateWorkflowStateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(32),
  color: z.string().min(1),
  description: z.string().max(120).optional(),
  isDefault: z.boolean().optional(),
});

export type UpdateWorkflowStateSchemaType = z.infer<
  typeof updateWorkflowStateSchema
>;

export const deleteWorkflowStateSchema = z.object({
  id: z.string(),
});

export type DeleteWorkflowStateSchemaType = z.infer<
  typeof deleteWorkflowStateSchema
>;

export const reorderWorkflowStatesSchema = z.object({
  teamId: z.string(),
  type: workflowTypeSchema,
  stateIds: z.array(z.string()).min(1),
});

export type ReorderWorkflowStatesSchemaType = z.infer<
  typeof reorderWorkflowStatesSchema
>;
