import * as z from "zod";

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
