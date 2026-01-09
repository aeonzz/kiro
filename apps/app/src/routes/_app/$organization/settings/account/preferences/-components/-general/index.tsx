import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SettingsCard,
  SettingsGroup,
  SettingsGroupTitle,
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemDescription,
  SettingsItemTitle,
} from "@/components/ui/settings-card";
import { Switch } from "@/components/ui/switch";

import { ViewControl } from "./view-control";

export function General({
  ...props
}: React.ComponentProps<typeof SettingsGroup>) {
  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>General</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Default home view</SettingsItemTitle>
            <SettingsItemDescription>
              Select which view to display when launching Linear
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <ViewControl />
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
