import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FontSizeValue } from "@/types/font";

interface PreferencesState {
  theme: "light" | "dark";
  cursorPointer: boolean;
  fontSize: FontSizeValue;
  setTheme: (theme: "light" | "dark") => void;
  setCursorPointer: (value: boolean) => void;
  setFontSize: (value: FontSizeValue) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      cursorPointer: false,
      fontSize: FontSizeValue.DEFAULT,
      setTheme: (theme) => set(() => ({ theme })),
      setCursorPointer: (value) => set(() => ({ cursorPointer: value })),
      setFontSize: (value) => set(() => ({ fontSize: value })),
    }),
    {
      name: "preferences-storage",
    }
  )
);
