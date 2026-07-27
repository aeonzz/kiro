import { create } from "zustand";
import { persist } from "zustand/middleware";

import { issueFilterTabs } from "@/config/team";
import { createFilterStore } from "@/lib/create-filter-store";
import { createUseFilters } from "@/hooks/use-filters";

export type { FilterOperator } from "@/types/filter";
export type { ActiveFilter as IssueFilter } from "@/types/filter";

export const useIssueFilterStore = createFilterStore("issue-filter-storage");

export const useIssueFilters = createUseFilters(useIssueFilterStore);

/**
 * The details panel narrows the same list as the toolbar but is not a chip
 * surface — the toolbar renders a chip for every filter in the plain tab scope,
 * so the panel writes to a sibling scope it owns instead. Routes AND the two
 * scopes together; the toolbar's Clear empties both.
 *
 * Keyed by tab key, so All / Active / Backlog each keep their own selections.
 * Sharing one scope across the three means narrowing Active silently rewrites
 * what All had, and returning to All shows someone else's filter.
 */
export function issuePanelScope(tabKey: string) {
  return `${tabKey}:panel`;
}

export const useIssuePanelFilters = (tabKey: string) =>
  useIssueFilters(issuePanelScope(tabKey));

/**
 * Which tab the panel is parked on, scoped alongside the selections it shows.
 * The two travel together — restoring a label selection onto the Assignees tab
 * would hide it, and reads as a lost filter.
 */
interface FilterPanelTabState {
  tabByScope: Record<string, string>;
  setTab: (scope: string, tab: string) => void;
}

const useFilterPanelTabStore = create<FilterPanelTabState>()(
  persist(
    (set) => ({
      tabByScope: {},
      setTab: (scope, tab) =>
        set((state) => ({
          tabByScope: { ...state.tabByScope, [scope]: tab },
        })),
    }),
    { name: "issue-filter-panel-tab-storage" }
  )
);

export function useIssueFilterPanelTab(tabKey: string) {
  const scope = issuePanelScope(tabKey);
  const tab = useFilterPanelTabStore(
    // A stored value outlives a rename in issueFilterTabs. Resolve it against
    // the current tabs so a stale one falls back instead of leaving the panel
    // with no active tab at all.
    (state) =>
      issueFilterTabs.find((t) => t.value === state.tabByScope[scope])?.value ??
      issueFilterTabs[0].value
  );
  const setTab = useFilterPanelTabStore((state) => state.setTab);

  return { tab, setTab: (next: string) => setTab(scope, next) };
}
