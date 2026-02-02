import { MOCK_ISSUES } from "@/mocks/issues";
import { create } from "zustand";

import type { Issue } from "@/types/issue";

interface IssueState {
  issues: Issue[];
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  setIssues: (issues: Issue[]) => void;
}

export const useIssueStore = create<IssueState>((set) => ({
  issues: MOCK_ISSUES,
  updateIssue: (id, updates) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, ...updates } : issue
      ),
    })),
  setIssues: (issues) => set({ issues }),
}));
