import type { WorkflowGroupType } from "@/config/workflow";

import type { IssuePriority } from "./enums";

export type Issue = {
  id: string;
  number?: number;
  title: string;
  stateId?: string;
  status: WorkflowGroupType;
  priority: IssuePriority;
  createdAt: string;
  updatedAt: string;
  assigneeId?: string;
  labelIds: string[];
};
