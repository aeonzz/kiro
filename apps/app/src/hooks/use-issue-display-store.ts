import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  completedIssuesOptions,
  issueGroupOptions,
  issueOrderOptions,
} from "@/config/team";
import { useOrganization } from "@/components/organization-context";

export interface IssueDisplayConfig {
  grouping: string;
  ordering: string;
  direction: "asc" | "desc";
  completedIssues: string;
  showSubIssues: boolean;
  showEmptyGroups: boolean;
  displayProperties: string[];
  layout: "list" | "board";
}

export const DEFAULT_CONFIG: IssueDisplayConfig = {
  layout: "list",
  grouping:
    issueGroupOptions.find((o) => o.value === "status")?.value ?? "status",
  ordering:
    issueOrderOptions.find((o) => o.value === "manual")?.value ?? "manual",
  direction: "desc",
  completedIssues:
    completedIssuesOptions.find((o) => o.value === "all")?.value ?? "all",
  showSubIssues: true,
  showEmptyGroups: false,
  displayProperties: [
    "id",
    "priority",
    "status",
    "assignee",
    "project",
    "labels",
    "created",
  ],
};

interface IssueDisplayState {
  configs: Record<string, IssueDisplayConfig>;
  setConfig: (key: string, config: Partial<IssueDisplayConfig>) => void;
}

export const useIssueDisplayStore = create<IssueDisplayState>()(
  persist(
    (set) => ({
      configs: {},
      setConfig: (key, config) =>
        set((state) => ({
          configs: {
            ...state.configs,
            [key]: {
              ...(state.configs[key] ?? DEFAULT_CONFIG),
              ...config,
            },
          },
        })),
    }),
    {
      name: "issue-display-storage",
    }
  )
);

export function useIssueDisplayOptions(key?: string) {
  const store = useIssueDisplayStore();
  const config = key ? (store.configs[key] ?? DEFAULT_CONFIG) : DEFAULT_CONFIG;

  return {
    ...config,
    setGrouping: (grouping: string) =>
      key && store.setConfig(key, { grouping }),
    setOrdering: (ordering: string) =>
      key && store.setConfig(key, { ordering }),
    setDirection: (direction: "asc" | "desc") =>
      key && store.setConfig(key, { direction }),
    setCompletedIssues: (completedIssues: string) =>
      key && store.setConfig(key, { completedIssues }),
    setShowSubIssues: (showSubIssues: boolean) =>
      key && store.setConfig(key, { showSubIssues }),
    setShowEmptyGroups: (showEmptyGroups: boolean) =>
      key && store.setConfig(key, { showEmptyGroups }),
    setDisplayProperties: (displayProperties: string[]) =>
      key && store.setConfig(key, { displayProperties }),
    setLayout: (layout: "list" | "board") =>
      key && store.setConfig(key, { layout }),
    reset: () => key && store.setConfig(key, DEFAULT_CONFIG),
    isDefault: JSON.stringify(config) === JSON.stringify(DEFAULT_CONFIG),
  };
}

export function useActiveIssueDisplayOptions(teamId: string) {
  const { activeOrganization } = useOrganization();
  const key = activeOrganization
    ? `${activeOrganization.id}:${teamId}`
    : undefined;
  return useIssueDisplayOptions(key);
}
