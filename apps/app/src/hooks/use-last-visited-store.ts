import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LastVisitedState {
  lastIssueTabs: Record<string, string>;
  setLastIssueTab: (orgSlug: string, teamSlug: string, tabUrl: string) => void;
  getLastIssueTab: (orgSlug: string, teamSlug: string) => string | undefined;
}

export const useLastVisitedStore = create<LastVisitedState>()(
  persist(
    (set, get) => ({
      lastIssueTabs: {},
      setLastIssueTab: (orgSlug, teamSlug, tabUrl) =>
        set((state) => ({
          lastIssueTabs: {
            ...state.lastIssueTabs,
            [`${orgSlug}/${teamSlug}`]: tabUrl,
          },
        })),
      getLastIssueTab: (orgSlug, teamSlug) =>
        get().lastIssueTabs[`${orgSlug}/${teamSlug}`],
    }),
    {
      name: "last-visited-tabs-storage",
    }
  )
);
