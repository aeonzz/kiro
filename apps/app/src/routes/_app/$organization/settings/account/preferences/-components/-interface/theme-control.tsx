import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-providers";

export function ThemeControl() {
  const { themes, setTheme, theme } = useTheme();
  return (
    <Select
      value={theme}
      itemToStringValue={(item) => item.value}
      onValueChange={(value) => setTheme(value?.value ?? "dark")}
    >
      <SelectTrigger className="min-w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {themes.map((theme) => (
            <SelectItem key={theme.value} value={theme}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
