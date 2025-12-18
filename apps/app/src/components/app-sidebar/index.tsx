import * as React from "react";
import { Pen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "@tanstack/react-router";

import { sidebarMenuItems } from "@/config/nav";
import { isNavLinkActive, resolveOrgUrl } from "@/lib/utils";

import { useOrganization } from "../organization-context";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { UserMenu } from "../user-menu";
import { TeamNav } from "./team-nav";
import { WorkspaceNav } from "./workspace-nav";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isPending?: boolean;
}

export function AppSidebar({
  isPending,
  variant = "inset",
  ...props
}: AppSidebarProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const { teams, activeOrganization } = useOrganization();

  const [sidebarState, setSidebarState] = React.useState(() => {
    try {
      const saved = localStorage.getItem("userSettings");
      return saved
        ? JSON.parse(saved)
        : { workspaceOpen: true, teamsOpen: true };
    } catch {
      return { workspaceOpen: true, teamsOpen: true };
    }
  });

  React.useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(sidebarState));
  }, [sidebarState]);

  const { workspaceOpen, teamsOpen } = sidebarState;

  const setWorkspaceOpen = React.useCallback((open: boolean) => {
    setSidebarState((prev: { workspaceOpen: boolean; teamsOpen: boolean }) => ({
      ...prev,
      workspaceOpen: open,
    }));
  }, []);

  const setTeamsOpen = React.useCallback((open: boolean) => {
    setSidebarState((prev: { workspaceOpen: boolean; teamsOpen: boolean }) => ({
      ...prev,
      teamsOpen: open,
    }));
  }, []);

  return (
    <Sidebar variant={variant} {...props}>
      {!isPending && (
        <React.Fragment>
          <SidebarHeader className="flex-row">
            <UserMenu />
            <Button variant="secondary" size="icon">
              <HugeiconsIcon icon={Pen01Icon} strokeWidth={2} />
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarMenuItems.map((item) => {
                    const itemUrl = resolveOrgUrl(
                      item.url,
                      activeOrganization?.slug
                    );
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          size="sm"
                          isActive={isNavLinkActive(
                            pathname,
                            item.url,
                            activeOrganization?.slug
                          )}
                          render={
                            <Link
                              to={itemUrl}
                              params={{
                                organization: activeOrganization?.slug,
                              }}
                            />
                          }
                        >
                          <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <WorkspaceNav
              pathname={pathname}
              open={workspaceOpen}
              onOpenChange={setWorkspaceOpen}
              activeOrganizationSlug={activeOrganization?.slug}
            />
            <TeamNav
              teams={teams}
              pathname={pathname}
              open={teamsOpen}
              onOpenChange={setTeamsOpen}
              activeOrganizationSlug={activeOrganization?.slug}
            />
          </SidebarContent>
        </React.Fragment>
      )}
    </Sidebar>
  );
}
