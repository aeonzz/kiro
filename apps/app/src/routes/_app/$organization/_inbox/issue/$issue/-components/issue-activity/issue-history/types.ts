import type { PowerSyncIssueHistoryEntry as HistoryEntry } from "@/lib/collections/issue-history-powersync";
import type {
  PowerSyncLabelOption,
  PowerSyncMemberOption,
  PowerSyncProjectOption,
  PowerSyncWorkflowState,
} from "@/lib/collections/team-metadata-powersync";

export type { HistoryEntry };

export type HistoryChange = Pick<
  HistoryEntry,
  "field" | "oldValue" | "newValue"
>;

export type HistoryEvent = {
  id: string;
  actorId: string;
  createdAt: string;
  changes: HistoryChange[];
};

export type FeedItem =
  | { type: "event"; event: HistoryEvent }
  | { type: "cluster"; field: string; events: HistoryEvent[] };

export type LookupContext = {
  stateById: Map<string, PowerSyncWorkflowState>;
  memberById: Map<string, PowerSyncMemberOption>;
  projectById: Map<string, PowerSyncProjectOption>;
  labelById: Map<string, PowerSyncLabelOption>;
};

export type DescribedPart =
  | { kind: "text"; text: string }
  | { kind: "labels"; verb: string; labelIds: string[] };
