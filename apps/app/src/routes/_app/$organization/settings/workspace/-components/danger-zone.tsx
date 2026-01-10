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

import { deleteOrganizationDialogHandle } from "../../-components/delete-organization-dialog";

export function DangerZone({
  ...props
}: React.ComponentProps<typeof SettingsGroup>) {
  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>Organization access</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Delete organization</SettingsItemTitle>
          </SettingsItemContent>
          <SettingsItemControl>
            <AlertDialogTrigger
              handle={deleteOrganizationDialogHandle}
              render={<Button variant="ghostDestructive" />}
            >
              Delete organization
            </AlertDialogTrigger>
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
