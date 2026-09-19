import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type IssueNavEntry = {
  id: string;
  identifier: string;
  title: string;
};

interface IssueNavigationState {
  entries: IssueNavEntry[];
  setEntries: (entries: IssueNavEntry[]) => void;
}

export const useIssueNavigationStore = create<IssueNavigationState>()(
  persist(
    (set) => ({
      entries: [],
      setEntries: (entries) => set({ entries }),
    }),
    {
      name: "issue-navigation-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
