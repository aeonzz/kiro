import { FontSize, fontSizes } from "@/types/font";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import { useUserPreferences } from "@/hooks/use-user-preferences";
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

  const { mutateAsync } = useUserPreferences();

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
