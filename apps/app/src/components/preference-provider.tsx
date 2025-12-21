import * as React from "react";

import { usePreferencesStore } from "@/hooks/use-preference-store";

export function PreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cursorPointer = usePreferencesStore((s) => s.cursorPointer);
  const fontSize = usePreferencesStore((s) => s.fontSize);

  React.useEffect(() => {
    document.documentElement.dataset.cursorPointer = cursorPointer
      ? "true"
      : "false";
  }, [cursorPointer]);

  React.useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  return <>{children}</>;
}
