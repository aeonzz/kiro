import * as React from "react";

import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
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

import { teamDeleteAlertDialogHandle } from "../../-components/delete-alert-dialog";

interface DangerZoneProps extends React.ComponentProps<typeof SettingsGroup> {
  team: { name: string; id: string };
}

export function DangerZone({ team, ...props }: DangerZoneProps) {
  const { name, id } = team;

  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>Danger zone</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Delete team</SettingsItemTitle>
          </SettingsItemContent>
          <SettingsItemControl>
            <Button
              variant="destructive"
              render={
                <AlertDialogTrigger
                  handle={teamDeleteAlertDialogHandle}
                  payload={{ name, id, redirect: true }}
                />
              }
            >
              Delete team
            </Button>
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
