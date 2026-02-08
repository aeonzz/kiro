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
import { useOrganization } from "@/components/organization-context";

import { deleteOrganizationDialogHandle } from "../../../-components/delete-organization-dialog";

export function OrganizationAccess({
  ...props
}: React.ComponentProps<typeof SettingsGroup>) {
  const { activeOrganization } = useOrganization();
  const isOwner = activeOrganization?.userRole === "owner";

  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>Organization access</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>
              {isOwner ? "Delete organization" : "Leave organization"}
            </SettingsItemTitle>
          </SettingsItemContent>
          <SettingsItemControl>
            <AlertDialogTrigger
              handle={deleteOrganizationDialogHandle}
              render={<Button variant="ghostDestructive" />}
            >
              {isOwner ? "Delete" : "Leave"}
            </AlertDialogTrigger>
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
