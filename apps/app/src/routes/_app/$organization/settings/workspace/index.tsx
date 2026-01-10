import { createFileRoute } from "@tanstack/react-router";

import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";

import { DangerZone } from "./-components/danger-zone";
import { General } from "./-components/general";

export const Route = createFileRoute("/_app/$organization/settings/workspace/")(
  {
    head: () => ({
      meta: [{ title: "Workspace", description: "Workspace" }],
    }),
    errorComponent: Error,
    notFoundComponent: () => {
      return <NotFound />;
    },
    component: RouteComponent,
  }
);

function RouteComponent() {
  return (
    <SettingsContainer>
      <h1 className="text-foreground text-2xl font-medium">Workspace</h1>
      <General />
      <DangerZone />
    </SettingsContainer>
  );
}
