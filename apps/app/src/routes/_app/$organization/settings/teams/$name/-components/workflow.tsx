import * as React from "react";
import { ArrowRight01Icon, StatusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  SettingsCard,
  SettingsGroup,
  SettingsGroupTitle,
  SettingsItem,
  SettingsItemContent,
  SettingsItemControl,
  SettingsItemDescription,
  SettingsItemMedia,
  SettingsItemTitle,
} from "@/components/ui/settings-card";
import { Link, useParams } from "@tanstack/react-router";

interface WorkflowProps extends React.ComponentProps<typeof SettingsGroup> {}

export function Workflow({ ...props }: WorkflowProps) {
  const { name, organization } = useParams({
    from: "/_app/$organization/settings/teams/$name/",
  });

  return (
    <SettingsGroup {...props}>
      <SettingsGroupTitle>Workflow</SettingsGroupTitle>
      <SettingsCard>
        <SettingsItem
          render={
            <Link
              to="/$organization/settings/teams/$name/statuses"
              params={{
                name,
                organization,
              }}
            />
          }
        >
          <SettingsItemMedia variant="icon">
            <HugeiconsIcon icon={StatusIcon} strokeWidth={2} />
          </SettingsItemMedia>
          <SettingsItemContent>
            <SettingsItemTitle>Issue statuses</SettingsItemTitle>
            <SettingsItemDescription>
              Customize the statuses issues go through
            </SettingsItemDescription>
          </SettingsItemContent>
          <SettingsItemControl>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </SettingsItemControl>
        </SettingsItem>
      </SettingsCard>
    </SettingsGroup>
  );
}
