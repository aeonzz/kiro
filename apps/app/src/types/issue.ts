import type { WorkflowGroupType } from "@/config/workflow";

import type { IssuePriority } from "./enums";

export type Issue = {
  id: string;
  number?: number;
  title: string;
  stateId?: string;
  status: WorkflowGroupType;
  priority: IssuePriority;
  position?: number;
  createdAt: string;
  updatedAt: string;
  assigneeId?: string;
  creatorId?: string;
  projectId?: string;
  parentId?: string;
  labelIds: string[];
};
