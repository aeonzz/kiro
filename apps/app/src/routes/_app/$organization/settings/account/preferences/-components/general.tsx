import * as React from "react";

import { cn } from "@/lib/utils";
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

interface GeneralProps extends React.ComponentProps<typeof SettingsGroup> {}

export function General({ ...props }: GeneralProps) {
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
            <Select defaultValue="active">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active issues</SelectItem>
                <SelectItem value="all">All issues</SelectItem>
              </SelectContent>
            </Select>
          </SettingsItemControl>
        </SettingsItem>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>Display full names</SettingsItemTitle>
            <SettingsItemDescription>
              Show full names of users instead of shorter usernames
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <Switch />
          </SettingsItemControl>
        </SettingsItem>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>First day of the week</SettingsItemTitle>
            <SettingsItemDescription>
              Used for date pickers
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <Select defaultValue="sunday">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectContent>
            </Select>
          </SettingsItemControl>
        </SettingsItem>
        <SettingsItem>
          <SettingsItemContent>
            <SettingsItemTitle>
              Convert text emoticons into emojis
            </SettingsItemTitle>
            <SettingsItemDescription>
              Strings like :) will be converted to 🙂
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <Switch defaultChecked />
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
