import type { Value } from "platejs";
import * as z from "zod";

export const issueDraftSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string(),
  teamId: z.string(),
  projectId: z.string().nullable(),
  creatorId: z.string(),
  title: z.string(),
  description: z.custom<Value>(),
  status: z.string(),
  priority: z.string(),
  labels: z.array(z.string()),
});

export type IssueDraft = z.infer<typeof issueDraftSchema>;

export const issueDraftInputSchema = issueDraftSchema.omit({
  updatedAt: true,
  organizationId: true,
  creatorId: true,
});

export type IssueDraftInput = z.infer<typeof issueDraftInputSchema>;
