import {
  AlertSquareIcon,
  CheckmarkCircle01Icon,
  CircleArrowLeftRightIcon,
  CircleIcon,
  DashedLine01Icon,
  DashedLineCircleIcon,
  Delete04Icon,
  Folder01Icon,
  FullSignalIcon,
  LowSignalIcon,
  MediumSignalIcon,
  MultiplicationSignCircleIcon,
  NotificationSquareIcon,
  PlayCircleIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons";

import { FilterOptions } from "@/types/inbox";
import {
  BacklogIcon,
  CancelledIcon,
  DoneIcon,
  InProgressIcon,
  InReviewIcon,
  TodoIcon,
} from "@/components/icons";

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

export const displayOptions = [
  {
    value: "id",
    label: "ID",
  },
  {
    value: "status-and-icon",
    label: "Status and icon",
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
    multiIcon: true,
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

export const issueStatusMap = {
  TRIAGE: {
    label: "Triage",
    icon: TodoIcon,
    fillClass: "text-muted-foreground",
  },
  BACKLOG: {
    label: "Backlog",
    icon: BacklogIcon,
    fillClass: "text-muted-foreground",
  },
  UNSTARTED: {
    label: "Todo",
    icon: TodoIcon,
    fillClass: "text-muted-foreground",
  },
  STARTED: {
    label: "In Progress",
    icon: InProgressIcon,
    fillClass: "text-yellow-500",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: InReviewIcon,
    fillClass: "text-green-500",
  },
  COMPLETED: {
    label: "Done",
    icon: DoneIcon,
    fillClass: "text-indigo-500",
  },
  CANCELLED: {
    label: "Canceled",
    icon: CancelledIcon,
    fillClass: "text-muted-foreground",
  },
} as const;

export const issuePriorityMap = {
  NO_PRIORITY: { label: "No priority", icon: DashedLine01Icon },
  URGENT: { label: "Urgent", icon: AlertSquareIcon },
  HIGH: { label: "High", icon: FullSignalIcon },
  MEDIUM: { label: "Medium", icon: MediumSignalIcon },
  LOW: { label: "Low", icon: LowSignalIcon },
} as const;
