import type { ComponentType } from "react";

import type { WorkflowType } from "@kiro/db";

import {
  BacklogIcon,
  CancelledIcon,
  DoneIcon,
  InProgressIcon,
  TodoIcon,
  type IconProps,
} from "@/components/icons";

export const workflowGroupLabels = {
  BACKLOG: "Backlog",
  UNSTARTED: "Unstarted",
  STARTED: "Started",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
  DUPLICATE: "Duplicate",
} satisfies Record<WorkflowType, string>;

export const workflowGroupOrder = [
  "BACKLOG",
  "UNSTARTED",
  "STARTED",
  "COMPLETED",
  "CANCELED",
  "DUPLICATE",
] satisfies WorkflowType[];

export const workflowIconMap = {
  BACKLOG: BacklogIcon,
  UNSTARTED: TodoIcon,
  STARTED: InProgressIcon,
  COMPLETED: DoneIcon,
  CANCELED: CancelledIcon,
  DUPLICATE: CancelledIcon,
} satisfies Record<WorkflowType, ComponentType<IconProps>>;

export const getWorkflowIcon = (type: WorkflowType) => workflowIconMap[type];