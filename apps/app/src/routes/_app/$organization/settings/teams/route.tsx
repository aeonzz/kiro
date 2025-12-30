import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { DeleteAlertDialog } from "./-components/delete-alert-dialog";

export const Route = createFileRoute("/_app/$organization/settings/teams")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <DeleteAlertDialog />
    </React.Fragment>
  );
}
