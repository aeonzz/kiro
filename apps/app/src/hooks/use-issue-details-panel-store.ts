import { create } from "zustand";

interface IssueDetailsPanelState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useIssueDetailsPanelStore = create<IssueDetailsPanelState>(
  (set) => ({
    isOpen: true,
    setIsOpen: (isOpen) => set({ isOpen }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  })
);
