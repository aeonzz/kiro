import { create } from "zustand";

interface PanelState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useIssueDetailsPanelStore = create<PanelState>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useProjectsPanelStore = create<PanelState>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
