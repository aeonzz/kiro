import { create } from "zustand";

interface IssueDraftState {
  triggerDraftId: string | null;
  setTriggerDraftId: (draftId: string | null) => void;
}

export const useIssueDraftStore = create<IssueDraftState>()((set) => ({
  triggerDraftId: null,
  setTriggerDraftId: (draftId) => set({ triggerDraftId: draftId }),
}));
