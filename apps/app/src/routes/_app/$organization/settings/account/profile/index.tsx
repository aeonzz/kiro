import { createFileRoute } from "@tanstack/react-router";

import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";

import { General } from "./-components/general";
import { OrganizationAccess } from "./-components/organization-access";

export const Route = createFileRoute(
  "/_app/$organization/settings/account/profile/"
)({
  head: () => ({
    meta: [{ title: "Profile", description: "Profile" }],
  }),
  errorComponent: Error,
  notFoundComponent: () => {
    return <NotFound />;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SettingsContainer>
      <h1 className="text-foreground text-2xl font-medium">Profile</h1>
      <General />
      <OrganizationAccess />
    </SettingsContainer>
  );
}
