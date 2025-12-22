import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FontSizeValue } from "@/types/font";
import { NavItemVisibility } from "@/config/nav";

interface PreferencesState {
  theme: "light" | "dark";
  cursorPointer: boolean;
  fontSize: FontSizeValue;
  sidebarConfig: Record<string, NavItemVisibility>;
  workspaceOpen: boolean;
  teamsOpen: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setCursorPointer: (value: boolean) => void;
  setFontSize: (value: FontSizeValue) => void;
  setSidebarConfig: (title: string, visibility: NavItemVisibility) => void;
  setWorkspaceOpen: (open: boolean) => void;
  setTeamsOpen: (open: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      cursorPointer: false,
      fontSize: FontSizeValue.DEFAULT,
      sidebarConfig: {},
      workspaceOpen: true,
      teamsOpen: true,
      setTheme: (theme) => set(() => ({ theme })),
      setCursorPointer: (value) => set(() => ({ cursorPointer: value })),
      setFontSize: (value) => set(() => ({ fontSize: value })),
      setSidebarConfig: (title, visibility) =>
        set((state) => ({
          sidebarConfig: {
            ...state.sidebarConfig,
            [title]: visibility,
          },
        })),
      setWorkspaceOpen: (open) => set(() => ({ workspaceOpen: open })),
      setTeamsOpen: (open) => set(() => ({ teamsOpen: open })),
    }),
    {
      name: "preferences-storage",
    }
  )
);
