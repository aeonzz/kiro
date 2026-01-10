import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { MemberInvitationDialog } from "./-components/member-invitation-dialog";
import { DeleteOrganizationDialog } from "./-components/delete-organization-dialog";

export const Route = createFileRoute("/_app/$organization/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <MemberInvitationDialog />
      <DeleteOrganizationDialog />
    </React.Fragment>
  );
}
