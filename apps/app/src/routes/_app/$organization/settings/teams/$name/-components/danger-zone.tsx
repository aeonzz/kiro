import * as React from "react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  SettingsCard,
  SettingsGroup,
  SettingsGroupTitle,
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemTitle,
} from "@/components/ui/settings-card";

export function DangerZone({
  ...props
}: React.ComponentProps<typeof SettingsGroup>) {
  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>Danger zone</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Delete team</SettingsItemTitle>
          </SettingsItemContent>
          <SettingsItemControl>
            <Button variant="destructive">Delete team</Button>
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
