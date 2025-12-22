import { usePreferencesStore } from "@/hooks/use-preference-store";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { Switch } from "@/components/ui/switch";

export function CursorControl() {
  const cursorPointer = usePreferencesStore((s) => s.cursorPointer);
  const setCursorPointer = usePreferencesStore((s) => s.setCursorPointer);

  const { mutateAsync } = useUserPreferences();

  function handleToggle(value: boolean) {
    setCursorPointer(value);
    try {
      mutateAsync({ cursorPointer: value });
    } catch {}
  }

  return <Switch onCheckedChange={handleToggle} checked={cursorPointer} />;
}
