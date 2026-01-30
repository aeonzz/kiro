import type { StrictOmit } from "@/types";
import type { Value } from "platejs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IssueDraft {
  id: string;
  organizationId: string;
  title: string;
  description: Value;
  status: string;
  priority: string;
  labels: Array<string>;
  updatedAt: number;
}

interface IssueDraftState {
  draftsByOrg: Record<string, IssueDraft[]>;
  triggerDraftId: string | null;
  setTriggerDraftId: (draftId: string | null) => void;
  saveDraft: (
    orgId: string,
    draft: StrictOmit<IssueDraft, "updatedAt" | "organizationId">
  ) => void;
  deleteDraft: (orgId: string, draftId: string) => void;
  clearDrafts: (orgId: string) => void;
}

export const useIssueDraftStore = create<IssueDraftState>()(
  persist(
    (set) => ({
      draftsByOrg: {},
      triggerDraftId: null,
      setTriggerDraftId: (draftId) => set({ triggerDraftId: draftId }),
      saveDraft: (orgId, draft) =>
        set((state) => {
          const orgDrafts = state.draftsByOrg[orgId] ?? [];
          const existingDraftIndex = orgDrafts.findIndex(
            (d) => d.id === draft.id
          );
          const newDraft: IssueDraft = {
            ...draft,
            organizationId: orgId,
            updatedAt: Date.now(),
          };

          const newOrgDrafts = [...orgDrafts];
          if (existingDraftIndex !== -1) {
            newOrgDrafts[existingDraftIndex] = newDraft;
          } else {
            newOrgDrafts.unshift(newDraft);
          }

          return {
            draftsByOrg: {
              ...state.draftsByOrg,
              [orgId]: newOrgDrafts,
            },
          };
        }),
      deleteDraft: (orgId, draftId) =>
        set((state) => {
          const orgDrafts = state.draftsByOrg[orgId] ?? [];
          return {
            draftsByOrg: {
              ...state.draftsByOrg,
              [orgId]: orgDrafts.filter((d) => d.id !== draftId),
            },
          };
        }),
      clearDrafts: (orgId) =>
        set((state) => ({
          draftsByOrg: {
            ...state.draftsByOrg,
            [orgId]: [],
          },
        })),
    }),
    {
      name: "issue-draft-storage",
      partialize: (state) => ({ draftsByOrg: state.draftsByOrg }),
    }
  )
);

export function useIssueDrafts(orgId?: string) {
  const store = useIssueDraftStore();

  if (!orgId) {
    return {
      drafts: [] as IssueDraft[],
      saveDraft: () => {},
      deleteDraft: () => {},
      clearDrafts: () => {},
    };
  }

  return {
    drafts: store.draftsByOrg[orgId] ?? [],
    saveDraft: (draft: Omit<IssueDraft, "updatedAt" | "organizationId">) =>
      store.saveDraft(orgId, draft),
    deleteDraft: (draftId: string) => store.deleteDraft(orgId, draftId),
    clearDrafts: () => store.clearDrafts(orgId),
  };
}
