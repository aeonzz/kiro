import { create } from "zustand";

export interface CreateIssueTriggerContext {
  status?: string;
  teamId?: string;
  projectId?: string | null;
  priority?: string;
  assigneeId?: string | null;
}

interface CreateIssueState {
  triggerContext: CreateIssueTriggerContext | null;
  setTriggerContext: (ctx: CreateIssueTriggerContext | null) => void;
}

export const useCreateIssueStore = create<CreateIssueState>()((set) => ({
  triggerContext: null,
  setTriggerContext: (ctx) => set({ triggerContext: ctx }),
}));
