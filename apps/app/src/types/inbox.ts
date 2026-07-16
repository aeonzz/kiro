import { NotificationType } from "@/types/enums";
import { Notification as PrismaNotification } from "@/types/schema-types";

import { StrictOmit } from ".";

export type { IconType } from "@/types/icon";
export type { FilterOption, FilterConfig as FilterOptions } from "@/types/filter";

export type IssueAssignedData = {
  issueId: string;
  issueTitle: string;
  assignerId: string;
};

export type IssueCreatedData = {
  issueId: string;
  issueTitle: string;
  creatorId: string;
};

export type CommentCreatedData = {
  commentId: string;
  preview: string;
  discussionId: string;
};

export type MentionData = {
  sourceId: string;
  preview: string;
};

export type StateChangeData = {
  entityId: string;
  entityTitle: string;
  field: "status" | "priority" | "assignee";
  fromState: string;
  toState: string;
};

export type NotificationDataMap = {
  [NotificationType.ISSUE_ASSIGNED]: IssueAssignedData;
  [NotificationType.ISSUE_CREATED]: IssueCreatedData;
  [NotificationType.COMMENT_CREATED]: CommentCreatedData;
  [NotificationType.MENTION]: MentionData;
  [NotificationType.STATE_CHANGE]: StateChangeData;
};

export type GetNotificationData<T extends NotificationType> =
  NotificationDataMap[T];

type BaseNotification = StrictOmit<PrismaNotification, "type" | "data">;

export type TypedNotification = {
  [K in NotificationType]: BaseNotification & {
    type: K;
    data: GetNotificationData<K>;
  };
}[NotificationType];
