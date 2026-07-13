import type { Value } from "platejs";
import * as z from "zod";

import { IssuePriority } from "@/types/enums";

export const issueDraftSchema = z.object({
  id: z.string().optional(),
  organizationId: z.string(),
  teamId: z.string(),
  projectId: z.string().nullable(),
  creatorId: z.string(),
  title: z.string(),
  description: z.custom<Value>(),
  stateId: z.string(),
  priority: z.string(),
  labels: z.array(z.string()),
});

export type IssueDraft = z.infer<typeof issueDraftSchema>;

export const createIssueSchema = z.object({
  id: z.uuid().optional(),
  draftId: z.string().optional(),
  organizationId: z.string(),
  teamId: z.string(),
  projectId: z.string().nullable(),
  title: z.string().trim().min(1).max(512),
  description: z.custom<Value>(),
  stateId: z.string().min(1),
  priority: z.enum(IssuePriority),
  labels: z.array(z.string()),
});

export type CreateIssue = z.infer<typeof createIssueSchema>;

export const updateIssueSchema = z.object({
  id: z.string(),
  stateId: z.string().optional(),
  priority: z.enum(IssuePriority).optional(),
  assigneeId: z.string().nullable().optional(),
});

export type UpdateIssue = z.infer<typeof updateIssueSchema>;

export const issueLabelLinkSchema = z.object({
  issueId: z.string(),
  labelId: z.string(),
});

export type IssueLabelLink = z.infer<typeof issueLabelLinkSchema>;

export const issueDraftInputSchema = issueDraftSchema.omit({
  organizationId: true,
  creatorId: true,
});

export type IssueDraftInput = z.infer<typeof issueDraftInputSchema>;
