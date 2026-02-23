import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  closedProjectsOptions,
  projectDisplayOptions,
  projectGroupOptions,
  projectOrderOptions,
} from "@/config/team";
import { useOrganization } from "@/components/organization-context";

export interface ProjectDisplayConfig {
  grouping: string;
  ordering: string;
  direction: "asc" | "desc";
  closedProjects: string;
  showEmptyColumns: boolean;
  displayProperties: string[];
  layout: "list" | "board";
}

export const DEFAULT_CONFIG: ProjectDisplayConfig = {
  layout: "list",
  grouping:
    projectGroupOptions.find((o) => o.value === "none")?.value ?? "none",
  ordering:
    projectOrderOptions.find((o) => o.value === "manual")?.value ?? "manual",
  direction: "desc",
  closedProjects:
    closedProjectsOptions.find((o) => o.value === "all")?.value ?? "all",
  showEmptyColumns: true,
  displayProperties: ["priority", "status", "health", "lead", "target-date"],
};

interface ProjectIssueDisplayState {
  configs: Record<string, ProjectDisplayConfig>;
  setConfig: (key: string, config: Partial<ProjectDisplayConfig>) => void;
}

export const useProjectDisplayStore = create<ProjectIssueDisplayState>()(
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
      name: "project-display-storage",
    }
  )
);

export function useProjectDisplayOptions(key?: string) {
  const store = useProjectDisplayStore();
  const config = key ? (store.configs[key] ?? DEFAULT_CONFIG) : DEFAULT_CONFIG;

  return {
    ...config,
    setGrouping: (grouping: string) =>
      key && store.setConfig(key, { grouping }),
    setOrdering: (ordering: string) =>
      key && store.setConfig(key, { ordering }),
    setDirection: (direction: "asc" | "desc") =>
      key && store.setConfig(key, { direction }),
    setClosedProjects: (closedProjects: string) =>
      key && store.setConfig(key, { closedProjects }),
    setShowEmptyColumns: (showEmptyColumns: boolean) =>
      key && store.setConfig(key, { showEmptyColumns }),
    setDisplayProperties: (displayProperties: string[]) =>
      key && store.setConfig(key, { displayProperties }),
    setLayout: (layout: "list" | "board") =>
      key && store.setConfig(key, { layout }),
    reset: () => key && store.setConfig(key, DEFAULT_CONFIG),
    isDefault: JSON.stringify(config) === JSON.stringify(DEFAULT_CONFIG),
  };
}

export function useActiveProjectDisplayOptions(projectId: string) {
  const { activeOrganization } = useOrganization();
  const key = activeOrganization
    ? `${activeOrganization.id}:project:${projectId}`
    : undefined;
  return useProjectDisplayOptions(key);
}
