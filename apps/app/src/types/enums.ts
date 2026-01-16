export const NotificationType = {
  ISSUE_ASSIGNED: "ISSUE_ASSIGNED",
  ISSUE_CREATED: "ISSUE_CREATED",
  COMMENT_CREATED: "COMMENT_CREATED",
  MENTION: "MENTION",
  STATE_CHANGE: "STATE_CHANGE",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const IssueStatus = {
  TRIAGE: "TRIAGE",
  BACKLOG: "BACKLOG",
  UNSTARTED: "UNSTARTED",
  STARTED: "STARTED",
  IN_REVIEW: "IN_REVIEW",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssuePriority = {
  NO_PRIORITY: "NO_PRIORITY",
  URGENT: "URGENT",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

export type IssuePriority = (typeof IssuePriority)[keyof typeof IssuePriority];
