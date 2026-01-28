import {
  AlertSquareIcon,
  CheckmarkCircle01Icon,
  CircleArrowLeftRightIcon,
  CircleIcon,
  DashedLine01Icon,
  DashedLineCircleIcon,
  FullSignalIcon,
  LowSignalIcon,
  MediumSignalIcon,
  MultiplicationSignCircleIcon,
  PlayCircleIcon,
} from "@hugeicons/core-free-icons";

import type { FilterOptions } from "@/types/inbox";
import type { TeamIssueTab } from "@/types/team";
import {
  BacklogIcon,
  CancelledIcon,
  CopyIcon,
  DoneIcon,
  InProgressIcon,
  InReviewIcon,
  TodoIcon,
} from "@/components/icons";

export const teamIssueTabs: Array<TeamIssueTab> = [
  {
    title: "All issues",
    url: "/$organization/team/$team/all",
    icon: CopyIcon,
  },
  {
    title: "Active",
    url: "/$organization/team/$team/active",
    icon: InProgressIcon,
  },
  {
    title: "Backlog",
    url: "/$organization/team/$team/backlog",
    icon: BacklogIcon,
  },
];

export const issueGroupOptions = [
  {
    value: "none",
    label: "No grouping",
  },
  {
    value: "status",
    label: "Status",
  },
  {
    value: "assignee",
    label: "Assignee",
  },
  {
    value: "project",
    label: "Project",
  },
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "label",
    label: "Label",
  },
  {
    value: "parent",
    label: "Parent issue",
  },
];

export const issueOrderOptions = [
  {
    value: "manual",
    label: "Manual",
  },
  {
    value: "title",
    label: "Title",
  },
  {
    value: "status",
    label: "Status",
  },
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "assignee",
    label: "Assignee",
  },
  {
    value: "updated",
    label: "Updated",
  },
  {
    value: "created",
    label: "Created",
  },
];

export const completedIssuesOptions = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "past-day",
    label: "Past day",
  },
  {
    value: "past-week",
    label: "Past week",
  },
  {
    value: "past-month",
    label: "Past month",
  },
  {
    value: "none",
    label: "none",
  },
];

export const issueDisplayOptions = [
  {
    value: "id",
    label: "ID",
  },
  {
    value: "status",
    label: "Status",
  },
  {
    value: "assignee",
    label: "Assignee",
  },
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "project",
    label: "Project",
  },
  {
    value: "labels",
    label: "Labels",
  },
  {
    value: "time-in-status",
    label: "Time in status",
  },
  {
    value: "created",
    label: "Created",
  },
  {
    value: "updated",
    label: "Updated",
  },
  {
    value: "pull-requests",
    label: "Pull requests",
  },
];

export const issueFilterTabs = [
  {
    value: "assignees",
    label: "Assignees",
  },
  {
    value: "labels",
    label: "Labels",
  },
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "projects",
    label: "Projects",
  },
];

export const issueFilterOptions: FilterOptions[] = [
  {
    id: "status",
    label: "Status",
    multiLabel: "statuses",
    multiIcon: true,
    icon: BacklogIcon,
    options: [
      {
        value: "backlog",
        label: "Backlog",
        icon: BacklogIcon,
        iconFill: "text-muted-foreground!",
      },
      {
        value: "todo",
        label: "Todo",
        icon: TodoIcon,
        iconFill: "text-muted-foreground!",
      },
      {
        value: "in-progress",
        label: "In Progress",
        icon: InProgressIcon,
        iconFill: "text-yellow-500!",
      },
      {
        value: "in-review",
        label: "In Review",
        icon: InReviewIcon,
        iconFill: "text-green-500!",
      },
      {
        value: "done",
        label: "Done",
        icon: DoneIcon,
        iconFill: "text-indigo-500!",
      },
      {
        value: "cancelled",
        label: "Cancelled",
        icon: CancelledIcon,
        iconFill: "text-muted-foreground!",
      },
      {
        value: "duplicate",
        label: "Duplicate",
        icon: CancelledIcon,
        iconFill: "text-muted-foreground!",
      },
    ],
  },
  {
    id: "status-type",
    label: "Status type",
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
];
