import { createFileRoute } from "@tanstack/react-router";

import SettingsContainer from "@/components/settings-container";

import { General } from "./-components/general";
import { Interface } from "./-components/-interface";

export const Route = createFileRoute(
  "/_app/$organization/settings/account/preferences/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SettingsContainer>
      <h1 className="text-foreground text-2xl font-medium">Preferences</h1>
      <General />
      <Interface />
    </SettingsContainer>
  );
}
