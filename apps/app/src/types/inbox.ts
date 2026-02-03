import type { IconSvgElement } from "@hugeicons/react";

import { NotificationType } from "@/types/enums";
import { Notification as PrismaNotification } from "@/types/schema-types";
import type { IconProps } from "@/components/icons";

import { StrictOmit } from ".";

export type IconType = IconSvgElement | React.ComponentType<IconProps>;

export type FilterOption = {
  value: string;
  label: string;
  icon?: IconType;
  color?: string;
  avatarUrl?: string;
};

export type FilterOptions = {
  id: string;
  label: string;
  multiLabel: string;
  multiIcon?: boolean;
  icon: IconType;
  options: FilterOption[];
};

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
