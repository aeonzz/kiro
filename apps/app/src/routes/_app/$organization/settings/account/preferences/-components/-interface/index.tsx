import * as React from "react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
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

import { sidebarCustomizationHandle } from "../../../../../../../../components/app-sidebar/sidebar-control";
import { CursorControl } from "./cursor-control";
import { FontControl } from "./font-control";
import { ThemeControl } from "./theme-control";

interface InterfaceProps extends React.ComponentProps<typeof SettingsGroup> {}

export function Interface({ ...props }: InterfaceProps) {
  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>Interface and theme</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>App sidebar</SettingsItemTitle>
            <SettingsItemDescription>
              Customize sidebar item visibility, ordering, and more
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <DialogTrigger
              handle={sidebarCustomizationHandle}
              render={<Button variant="ghost" />}
            >
              Customize
            </DialogTrigger>
          </SettingsItemControl>
        </SettingsItem>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Font size</SettingsItemTitle>
            <SettingsItemDescription>
              Adjust the font size for better readability
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <FontControl />
          </SettingsItemControl>
        </SettingsItem>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Use pointer cursors</SettingsItemTitle>
            <SettingsItemDescription>
              Change the cursor to a pointer when hovering over any interactive
              elements
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <CursorControl />
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
      <SettingsCard>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Interface theme</SettingsItemTitle>
            <SettingsItemDescription>
              Customize interface theme
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <ThemeControl />
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
