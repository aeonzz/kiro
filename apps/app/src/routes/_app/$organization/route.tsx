import * as React from "react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarControl } from "@/components/app-sidebar/sidebar-control";
import { CreateIssueDialog } from "@/components/create-issue-dialog";
import { useOrganization } from "@/components/organization-context";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";

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
              <div className="from-muted-foreground to-muted flex size-8 animate-pulse items-center justify-center rounded-full bg-radial-[at_25%_25%] to-75%" />
            </div>
          ) : (
            <Outlet />
          )}
        </SidebarInset>
      </SidebarProvider>
      <SidebarControl />
      <CreateIssueDialog />
    </React.Fragment>
  );
}
