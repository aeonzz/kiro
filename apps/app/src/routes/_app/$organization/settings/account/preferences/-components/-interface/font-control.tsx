import { setUserPreferencesFn } from "@/services/user/create";
import type { SetUserPreferencesInput } from "@/services/user/schema";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { FontSize, fontSizes } from "@/types/font";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FontControl() {
  const setFontSize = usePreferencesStore((s) => s.setFontSize);
  const fontSize = usePreferencesStore((s) => s.fontSize);
  const setUserPreferences = useServerFn(setUserPreferencesFn);

  const { mutateAsync } = useMutation({
    mutationFn: (data: SetUserPreferencesInput) => setUserPreferences({ data }),
  });

  const selectedFontSize = fontSizes.find((f) => f.value === fontSize);

  const handleFontSizeChange = (value: FontSize | null) => {
    if (!value) return;
    setFontSize(value.value);
    try {
      mutateAsync({ fontSize: value.value });
    } catch {}
  };

  return (
    <Select
      value={selectedFontSize}
      itemToStringValue={(item) => item.value}  
      onValueChange={handleFontSizeChange}
    >
      <SelectTrigger className="min-w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {fontSizes.map((fontSize) => (
            <SelectItem key={fontSize.value} value={fontSize}>
              {fontSize.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
