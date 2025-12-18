import * as z from "zod";

export const organizationInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  keepCurrentActiveOrganization: z.boolean().optional(),
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;
