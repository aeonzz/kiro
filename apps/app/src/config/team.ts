import {
  AlertSquareIcon,
  Calendar01Icon,
  CalendarCheckIn01Icon,
  CalendarCheckOut01Icon,
  CalendarSyncIcon,
  CircleIcon,
  Clock01Icon,
  DashedLine01Icon,
  Flag01Icon,
  Folder01Icon,
  FullSignalIcon,
  LabelIcon,
  LowSignalIcon,
  MediumSignalIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";

import { ProjectStatus } from "@/types/enums";
import type { FilterOptions } from "@/types/inbox";
import type { TeamIssueTab } from "@/types/team";
import {
  workflowGroupLabels,
  workflowGroupOrder,
  workflowIconMap,
} from "@/config/workflow";
import {
  BacklogIcon,
  CancelledIcon,
  CopyIcon,
  DoneIcon,
  InProgressIcon,
} from "@/components/icons";

export const teamIssueTabs: Array<TeamIssueTab> = [
  {
    title: "All issues",
    url: "/$organization/team/$team/all",
    icon: CopyIcon,
    shortcut: "1",
  },
  {
    title: "Active",
    url: "/$organization/team/$team/active",
    icon: InProgressIcon,
    shortcut: "2",
  },
  {
    title: "Backlog",
    url: "/$organization/team/$team/backlog",
    icon: BacklogIcon,
    shortcut: "3",
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

export const projectGroupOptions = [
  {
    value: "none",
    label: "No grouping",
  },
  {
    value: "lead",
    label: "Lead",
  },
  {
    value: "member",
    label: "Member",
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
    value: "label",
    label: "Label",
  },
  {
    value: "health",
    label: "Health",
  },
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "start",
    label: "Start date",
  },
  {
    value: "target",
    label: "Target date",
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

export const projectOrderOptions = [
  {
    value: "manual",
    label: "Manual",
  },
  {
    value: "name",
    label: "Name",
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
    value: "updated",
    label: "Updated",
  },
  {
    value: "created",
    label: "Created",
  },
  {
    value: "health",
    label: "Health updated",
  },
  {
    value: "start",
    label: "Start date",
  },
  {
    value: "target",
    label: "Target date",
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

export const closedProjectsOptions = [
  {
    value: "none",
    label: "None",
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
    value: "past-3-months",
    label: "Past 3 months",
  },
  {
    value: "past-6-months",
    label: "Past 6 months",
  },
  {
    value: "all",
    label: "All",
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
    value: "created",
    label: "Created",
  },
  {
    value: "updated",
    label: "Updated",
  },
];

export const projectDisplayOptions = [
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "status",
    label: "Status",
  },
  {
    value: "health",
    label: "Health",
  },
  {
    value: "teams",
    label: "Teams",
  },
  {
    value: "lead",
    label: "Lead",
  },
  {
    value: "members",
    label: "Members",
  },
  {
    value: "start-date",
    label: "Start date",
  },
  {
    value: "target-date",
    label: "Target date",
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
    value: "completed",
    label: "Completed",
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

export const dueDateOptions = [
  { value: "overdue", label: "Overdue" },
  { value: "1d-from-now", label: "1 day from now" },
  { value: "3d-from-now", label: "3 days from now" },
  { value: "1w-from-now", label: "1 week from now" },
  { value: "1m-from-now", label: "1 month from now" },
  { value: "3m-from-now", label: "3 months from now" },
  { value: "no-due-date", label: "No due date" },
];

export const dateRangeOptions = [
  { value: "1d", label: "1 day ago" },
  { value: "3d", label: "3 days ago" },
  { value: "1w", label: "1 week ago" },
  { value: "1m", label: "1 month ago" },
  { value: "3m", label: "3 months ago" },
  { value: "6m", label: "6 months ago" },
  { value: "1y", label: "1 year ago" },
];

export const completedDateOptions = [
  { value: "no-completed-date", label: "No completed date" },
  ...dateRangeOptions,
];

export const timeInStatusOptions = [
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
  { value: "2w", label: "2 weeks" },
  { value: "1m", label: "1 month" },
  { value: "3m", label: "3 months" },
  { value: "6m", label: "6 months" },
];

export const issueFilterOptions: FilterOptions[] = [
  {
    id: "status",
    label: "Status",
    multiLabel: "statuses",
    multiIcon: true,
    icon: BacklogIcon,
    options: [],
  },
  {
    id: "status-type",
    label: "Status type",
    multiLabel: "status types",
    multiIcon: true,
    icon: CircleIcon,
    options: workflowGroupOrder.map((type) => ({
      value: type,
      label: workflowGroupLabels[type],
      icon: workflowIconMap[type],
    })),
  },
  {
    id: "label",
    label: "Labels",
    multiLabel: "labels",
    multiIcon: true,
    icon: LabelIcon,
    options: [],
  },
  {
    id: "assignee",
    label: "Assignee",
    multiLabel: "assignees",
    icon: User02Icon,
    options: [],
  },
  {
    id: "creator",
    label: "Creator",
    multiLabel: "creators",
    icon: User02Icon,
    options: [],
  },
  {
    id: "project",
    label: "Project",
    multiLabel: "projects",
    icon: Folder01Icon,
    options: [],
  },
  {
    id: "priority",
    label: "Issue priority",
    multiLabel: "priorities",
    icon: FullSignalIcon,
    options: [
      {
        value: "NO_PRIORITY",
        label: "No priority",
        icon: DashedLine01Icon,
      },
      {
        value: "URGENT",
        label: "Urgent",
        icon: AlertSquareIcon,
      },
      {
        value: "HIGH",
        label: "High",
        icon: FullSignalIcon,
      },
      {
        value: "MEDIUM",
        label: "Medium",
        icon: MediumSignalIcon,
      },
      {
        value: "LOW",
        label: "Low",
        icon: LowSignalIcon,
      },
    ],
  },
  {
    id: "due-date",
    label: "Due date",
    multiLabel: "due dates",
    icon: Flag01Icon,
    options: dueDateOptions,
  },
  {
    id: "created-date",
    label: "Created date",
    multiLabel: "created dates",
    icon: Calendar01Icon,
    options: dateRangeOptions,
  },
  {
    id: "updated-date",
    label: "Updated date",
    multiLabel: "updated dates",
    icon: CalendarSyncIcon,
    options: dateRangeOptions,
  },
  {
    id: "started-date",
    label: "Started date",
    multiLabel: "started dates",
    icon: CalendarCheckIn01Icon,
    options: dateRangeOptions,
  },
  {
    id: "completed-date",
    label: "Completed date",
    multiLabel: "completed dates",
    icon: CalendarCheckOut01Icon,
    options: completedDateOptions,
  },
  {
    id: "time-in-status",
    label: "Time in current status",
    multiLabel: "time ranges",
    icon: Clock01Icon,
    options: timeInStatusOptions,
  },
];

export const projectStatusOptions = [
  {
    value: ProjectStatus.BACKLOG,
    label: "Backlog",
    icon: BacklogIcon,
    color: "var(--muted-foreground)",
  },
  {
    value: ProjectStatus.PLANNED,
    label: "Planned",
    icon: BacklogIcon,
    color: "var(--muted-foreground)",
  },
  {
    value: ProjectStatus.STARTED,
    label: "In Progress",
    icon: InProgressIcon,
    color: "oklch(79.5% 0.184 86.047)",
  },
  {
    value: ProjectStatus.COMPLETED,
    label: "Done",
    icon: DoneIcon,
    color: "oklch(58.5% 0.233 277.117)",
  },
  {
    value: ProjectStatus.CANCELED,
    label: "Cancelled",
    icon: CancelledIcon,
    color: "var(--muted-foreground)",
  },
];

export const projectFilterOptions: FilterOptions[] = [
  {
    id: "status",
    label: "Status",
    multiLabel: "statuses",
    multiIcon: true,
    icon: BacklogIcon,
    options: projectStatusOptions,
  },
  {
    id: "priority",
    label: "Issue priority",
    multiLabel: "priorities",
    icon: FullSignalIcon,
    options: [
      {
        value: "NO_PRIORITY",
        label: "No priority",
        icon: DashedLine01Icon,
      },
      {
        value: "URGENT",
        label: "Urgent",
        icon: AlertSquareIcon,
      },
      {
        value: "HIGH",
        label: "High",
        icon: FullSignalIcon,
      },
      {
        value: "MEDIUM",
        label: "Medium",
        icon: MediumSignalIcon,
      },
      {
        value: "LOW",
        label: "Low",
        icon: LowSignalIcon,
      },
    ],
  },
];
