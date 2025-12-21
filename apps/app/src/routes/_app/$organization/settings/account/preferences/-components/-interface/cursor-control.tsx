import { setUserPreferencesFn } from "@/services/user/create";
import { SetUserPreferencesInput } from "@/services/user/schema";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { usePreferencesStore } from "@/hooks/use-preference-store";
import { Switch } from "@/components/ui/switch";

export function CursorControl() {
  const cursorPointer = usePreferencesStore((s) => s.cursorPointer);
  const setCursorPointer = usePreferencesStore((s) => s.setCursorPointer);
  const setUserPreferences = useServerFn(setUserPreferencesFn);

  const { mutateAsync } = useMutation({
    mutationFn: (data: SetUserPreferencesInput) => setUserPreferences({ data }),
  });

  function handleToggle(value: boolean) {
    setCursorPointer(value);
    try {
      mutateAsync({ cursorPointer: value });
    } catch {}
  }

  return <Switch onCheckedChange={handleToggle} checked={cursorPointer} />;
}
