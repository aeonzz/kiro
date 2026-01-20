import type { TeamIssueTab } from "@/types/team";
import { BacklogIcon, CopyIcon, InProgressIcon } from "@/components/icons";

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
