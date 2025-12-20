import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
  theme: "light" | "dark";
  cursorPointer: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setCursorPointer: (value: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      cursorPointer: false,
      setTheme: (theme) => set(() => ({ theme })),
      setCursorPointer: (value) => set(() => ({ cursorPointer: value })),
    }),
    {
      name: "preferences-storage",
    }
  )
);
