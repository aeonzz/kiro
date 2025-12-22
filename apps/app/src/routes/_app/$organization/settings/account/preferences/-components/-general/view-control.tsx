import { HomeView } from "@/types/preferences";
import { homeViewOptions } from "@/config/preferences";
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

export function ViewControl() {
  const setHomeView = usePreferencesStore((s) => s.setHomeView);
  const homeView = usePreferencesStore((s) => s.homeView);

  const { mutateAsync } = useUserPreferences();

  const selectedHomeView = homeViewOptions.find((f) => f.value === homeView);

  const handleHomeViewChange = (value: HomeView | null) => {
    if (!value) return;
    setHomeView(value.value);
    try {
      mutateAsync({ homeView: value.value });
    } catch {}
  };

  return (
    <Select
      value={selectedHomeView}
      itemToStringValue={(item) => item.value}
      onValueChange={handleHomeViewChange}
    >
      <SelectTrigger className="min-w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {homeViewOptions.map((view) => (
            <SelectItem key={view.value} value={view}>
              {view.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
