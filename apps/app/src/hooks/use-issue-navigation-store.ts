import { create } from "zustand";

export type IssueNavEntry = {
  id: string;
  identifier: string;
  title: string;
};

interface IssueNavigationState {
  entries: IssueNavEntry[];
  setEntries: (entries: IssueNavEntry[]) => void;
}

/**
 * Holds the ordered list of issues from whichever list/board view the user
 * was most recently looking at, so the issue detail page can offer
 * Linear-style previous/next navigation through that same set. Deliberately
 * in-memory only (not persisted) — it reflects "what you were just looking
 * at" for this tab, not a durable preference.
 */
export const useIssueNavigationStore = create<IssueNavigationState>(
  (set) => ({
    entries: [],
    setEntries: (entries) => set({ entries }),
  })
);
