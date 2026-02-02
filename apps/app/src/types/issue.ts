import type { IssuePriority } from "./enums";

export type Issue = {
  id: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
  updatedAt: string;
  assigneeId?: string;
  labelIds: string[];
};

export type IssueStatus =
  | "BACKLOG"
  | "UNSTARTED"
  | "STARTED"
  | "IN_REVIEW"
  | "COMPLETED"
  | "CANCELLED"
  | "DUPLICATE";
