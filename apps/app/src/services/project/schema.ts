import { ProjectStatus } from "@kiro/db";
import * as z from "zod";

export const getOrganizationProjectSchema = z.object({
  slug: z.string(),
});

export type GetOrganizationProjectSchemaType = z.infer<
  typeof getOrganizationProjectSchema
>;

export const createProjectSchema = z.object({
  name: z.string(),
  summary: z.string(),
  teamId: z.string(),
  description: z.any(),
  status: z.enum(ProjectStatus),
  priority: z.string(),
  leadId: z.string().nullable(),
  startDate: z.date().nullable(),
  targetDate: z.date().nullable(),
  organizationId: z.string(),
});

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
