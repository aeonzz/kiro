import * as React from "react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

import {
  SidebarInset,
  SidebarMenuItemMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarControl } from "@/components/app-sidebar/sidebar-control";
import { useOrganization } from "@/components/organization-context";
import { SettingsSidebar } from "@/components/settings-sidebar";

export const Route = createFileRoute("/_app/$organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const { sidebarState } = Route.useRouteContext();
  const { isPending } = useOrganization();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isSettings = pathSegments[1] === "settings";

  return (
    <React.Fragment>
      <SidebarProvider
        defaultOpen={sidebarState}
        className="h-svh min-h-0! overflow-hidden"
      >
        {isSettings ? (
          <SettingsSidebar isPending={isPending} />
        ) : (
          <AppSidebar isPending={isPending} />
        )}
        <SidebarInset className="min-h-0 overflow-hidden">
          {isPending ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Outlet />
          )}
        </SidebarInset>
      </SidebarProvider>
      <SidebarControl />
      <SidebarMenuItemMenu />
    </React.Fragment>
  );
}
