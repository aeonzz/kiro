import { setUserPreferencesFn } from "@/services/user/create";
import { SetUserPreferencesInput } from "@/services/user/schema";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Switch } from "@/components/ui/switch";

export function CursorControl() {
  const setUserPreferences = useServerFn(setUserPreferencesFn);

  const { mutateAsync } = useMutation({
    mutationFn: (data: SetUserPreferencesInput) => setUserPreferences({ data }),
  });

  function handleToggle(value: boolean) {
    mutateAsync({
      cursorPointer: value,
    });
  }

  return <Switch onCheckedChange={handleToggle} />;
}
