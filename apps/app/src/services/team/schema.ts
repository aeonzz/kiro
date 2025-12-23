import * as z from "zod";

export const createTeamSchema = z.object({
  name: z.string(),
  slug: z.string(),
  organizationId: z.string(),
});

export type CreateTeamSchemaType = z.infer<typeof createTeamSchema>;
