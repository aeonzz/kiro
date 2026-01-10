import * as z from "zod";

export const organizationInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  keepCurrentActiveOrganization: z.boolean().optional(),
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;

export const getUserOrganizationSchema = z.object({
  slug: z.string(),
});

export type GetUserOrganization = z.infer<typeof getUserOrganizationSchema>;

export const updateOrganizationSchema = z.object({
  id: z.string(),
  payload: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;
