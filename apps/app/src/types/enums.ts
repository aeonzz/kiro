export const NotificationType = {
  ISSUE_ASSIGNED: "ISSUE_ASSIGNED",
  ISSUE_CREATED: "ISSUE_CREATED",
  COMMENT_CREATED: "COMMENT_CREATED",
  MENTION: "MENTION",
  STATE_CHANGE: "STATE_CHANGE",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const IssuePriority = {
  NO_PRIORITY: "NO_PRIORITY",
  URGENT: "URGENT",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

export type IssuePriority = (typeof IssuePriority)[keyof typeof IssuePriority];

export const ProjectStatus = {
  PLANNED: "PLANNED",
  STARTED: "STARTED",
  BACKLOG: "BACKLOG",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
