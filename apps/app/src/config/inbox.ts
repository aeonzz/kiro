import {
  AlertSquareIcon,
  CheckmarkCircle01Icon,
  CircleArrowLeftRightIcon,
  CircleIcon,
  Clipboard,
  Clock01Icon,
  CopyIcon,
  DashedLine01Icon,
  DashedLineCircleIcon,
  Delete04Icon,
  Folder01Icon,
  FullSignalIcon,
  InboxUnreadIcon,
  Link04Icon,
  LowSignalIcon,
  MediumSignalIcon,
  MultiplicationSignCircleIcon,
  NotificationOff01Icon,
  NotificationSnoozeIcon,
  NotificationSquareIcon,
  PlayCircleIcon,
  StarIcon,
  TextIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons";

import { FilterOptions, NotificationAction } from "@/types/inbox";

export const inboxDeleteOptions = [
  {
    value: "all",
    label: "Delete all",
    icon: Delete04Icon,
  },
  {
    value: "read",
    label: "Delete all read",
    icon: Delete04Icon,
  },
  {
    value: "completed",
    label: "Delete all fro completed issues",
    icon: Delete04Icon,
  },
];

export const orderingOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priority", label: "Priority" },
];

export const showItemsToggleOptions = [
  {
    value: "showSnoozedItems",
    label: "Show snoozed items",
  },
  {
    value: "showReadItems",
    label: "Show read items",
  },
  {
    value: "showUnreadItems",
    label: "Show unread items",
  },
];

export const filterOptions: FilterOptions[] = [
  {
    id: "type",
    label: "Notification type",
    multiLabel: "types",
    icon: NotificationSquareIcon,
    options: [
      {
        value: "status-changes",
        label: "Status changes",
      },
      {
        value: "assignments",
        label: "Assignments",
      },
      {
        value: "comments-and-replies",
        label: "Comments and replies",
      },
      {
        value: "customer-requests",
        label: "Customer requests",
      },
      {
        value: "document-changes",
        label: "Document changes",
      },
      {
        value: "mentions",
        label: "Mentions",
      },
      {
        value: "reactions",
        label: "Reactions",
      },
      {
        value: "reminders-and-deadlines",
        label: "Reminders and deadlines",
      },
      {
        value: "reviews",
        label: "Reviews",
      },
      {
        value: "subscriptions",
        label: "Subscriptions",
      },
      {
        value: "system-notifications",
        label: "System notifications",
      },
      {
        value: "triage",
        label: "Triage",
      },
      {
        value: "updates",
        label: "Updates",
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    multiLabel: "teams",
    icon: UserSquareIcon,
    options: [],
  },
  {
    id: "project",
    label: "Project",
    multiLabel: "projects",
    icon: Folder01Icon,
    options: [
      {
        value: "no-project",
        label: "No project",
        icon: Folder01Icon,
      },
    ],
  },
  {
    id: "priority",
    label: "Issue priority",
    multiLabel: "priorities",
    icon: FullSignalIcon,
    options: [
      {
        value: "no-priority",
        label: "No priority",
        icon: DashedLine01Icon,
      },
      {
        value: "urgent",
        label: "Urgent",
        icon: AlertSquareIcon,
      },
      {
        value: "high",
        label: "High",
        icon: FullSignalIcon,
      },
      {
        value: "medium",
        label: "Medium",
        icon: MediumSignalIcon,
      },
      {
        value: "low",
        label: "Low",
        icon: LowSignalIcon,
      },
    ],
  },
  {
    id: "status-type",
    label: "Issue status type",
    multiLabel: "status types",
    icon: CircleIcon,
    options: [
      {
        value: "triage",
        label: "Triage",
        icon: CircleArrowLeftRightIcon,
      },
      {
        value: "backlog",
        label: "Backlog",
        icon: DashedLineCircleIcon,
      },
      {
        value: "unstarted",
        label: "Unstarted",
        icon: CircleIcon,
      },
      {
        value: "started",
        label: "Started",
        icon: PlayCircleIcon,
      },
      {
        value: "completed",
        label: "Completed",
        icon: CheckmarkCircle01Icon,
      },
      {
        value: "cancelled",
        label: "Cancelled",
        icon: MultiplicationSignCircleIcon,
      },
    ],
  },
];

export const notificationActions: NotificationAction[] = [
  {
    value: "mark-as-unread",
    label: "Mark as unread",
    icon: InboxUnreadIcon,
    shortcut: "u",
    options: [],
  },
  {
    value: "mark-as-read",
    label: "Mark as read",
    icon: InboxUnreadIcon,
    options: [],
  },
  {
    value: "delete",
    label: "Delete notification",
    icon: Delete04Icon,
    shortcut: "⌫",
    options: [],
  },
  {
    value: "snooze",
    label: "Snooze",
    icon: NotificationSnoozeIcon,
    shortcut: "h",
    options: [
      {
        value: "hour",
        label: "An hour from now",
        icon: Clock01Icon,
      },
      {
        value: "tomorrow",
        label: "Tomorrow",
        icon: Clock01Icon,
      },
      {
        value: "next-week",
        label: "Next week",
        icon: Clock01Icon,
      },
      {
        value: "month",
        label: "A month from now",
        icon: Clock01Icon,
      },
    ],
  },
  {
    value: "unsubscribe",
    label: "Unsubscribe",
    icon: NotificationOff01Icon,
    options: [],
  },
  {
    value: "favorite",
    label: "Favorite",
    icon: StarIcon,
    options: [],
  },
  {
    value: "copy",
    label: "Copy",
    icon: Clipboard,
    options: [
      {
        value: "id",
        label: "Copy ID",
        icon: CopyIcon,
        shortcut: "ctrl ."
      },
      {
        value: "url",
        label: "Copy URL",
        icon: Link04Icon,
        shortcut: "ctrl ⇧ ,"
      },
      {
        value: "title",
        label: "Copy title",
        icon: TextIcon,
        shortcut: "ctrl ⇧ '"
      },
    ],
  },
];
