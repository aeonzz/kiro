import {
  BacklogIcon,
  CancelledIcon,
  DoneIcon,
  InProgressIcon,
  InReviewIcon,
  TodoIcon,
} from "@/components/icons";

type WorkflowStatus =
  | "BACKLOG"
  | "UNSTARTED"
  | "STARTED"
  | "IN_REVIEW"
  | "COMPLETED"
  | "CANCELED"
  | "CANCELLED";

const workflowIconMap: Record<WorkflowStatus, React.ComponentType<any>> = {
  BACKLOG: BacklogIcon,
  UNSTARTED: TodoIcon,
  STARTED: InProgressIcon,
  IN_REVIEW: InReviewIcon,
  COMPLETED: DoneIcon,
  CANCELED: CancelledIcon,
  CANCELLED: CancelledIcon,
};

export const getWorkflowIcon = (type: WorkflowStatus) => workflowIconMap[type];
