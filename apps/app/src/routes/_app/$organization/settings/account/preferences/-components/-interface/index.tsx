import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
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

import { ThemeControl } from "./theme-control";
import { CursorControl } from "./cursor-control";

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
            <Button variant="ghost">Customize</Button>
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
            <Select defaultValue="normal">
              <SelectTrigger className="min-w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
