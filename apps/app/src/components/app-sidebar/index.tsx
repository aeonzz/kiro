import * as React from "react";
import { Pen01Icon, TabletPenIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "@tanstack/react-router";

import {
  NavItemVisibility,
  sidebarMenuItems,
  sidebarWorkspaceItems,
} from "@/config/nav";
import { isNavLinkActive, resolveOrgUrl } from "@/lib/utils";
import { useIssueDrafts } from "@/hooks/use-issue-draft-store";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { createIssueDialogHandle } from "@/components/create-issue-dialog";

import { useOrganization } from "../organization-context";
import { Button } from "../ui/button";
import { DialogTrigger } from "../ui/dialog";
import { Kbd } from "../ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { UserMenu } from "../user-menu";
import { sidebarCustomizationHandle } from "./sidebar-control";
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
  const sidebarConfig = usePreferencesStore((state) => state.sidebarConfig);
  const workspaceOpen = usePreferencesStore((state) => state.workspaceOpen);
  const teamsOpen = usePreferencesStore((state) => state.teamsOpen);
  const setWorkspaceOpenStore = usePreferencesStore(
    (state) => state.setWorkspaceOpen
  );
  const setTeamsOpenStore = usePreferencesStore((state) => state.setTeamsOpen);
  const { mutateAsync } = useUserPreferences();
  const { drafts } = useIssueDrafts(activeOrganization?.slug);

  const setWorkspaceOpen = (open: boolean) => {
    setWorkspaceOpenStore(open);
    try {
      mutateAsync({ workspaceOpen: open });
    } catch {}
  };

  const setTeamsOpen = (open: boolean) => {
    setTeamsOpenStore(open);
    try {
      mutateAsync({ teamsOpen: open });
    } catch {}
  };

  const hiddenItems = React.useMemo(() => {
    return [...sidebarMenuItems, ...sidebarWorkspaceItems].filter((item) => {
      const visibility =
        sidebarConfig[item.title] ?? item.visibility ?? NavItemVisibility.Show;

      const isActive = isNavLinkActive(
        pathname,
        item.url,
        activeOrganization?.slug
      );

      if (isActive) return false;

      if (visibility === NavItemVisibility.Badged) {
        if (item.title === "Drafts" && drafts.length === 0) return true;
        return false;
      }

      return (
        visibility === NavItemVisibility.Hide ||
        visibility === NavItemVisibility.Auto
      );
    });
  }, [sidebarConfig, pathname, activeOrganization?.slug, drafts.length]);

  return (
    <Sidebar variant={variant} {...props}>
      {!isPending && (
        <React.Fragment>
          <SidebarHeader className="flex-row items-center">
            <UserMenu />

            <Tooltip>
              <TooltipTrigger
                render={
                  <DialogTrigger
                    handle={createIssueDialogHandle}
                    render={<Button variant="secondary" size="icon-sm" />}
                  />
                }
              >
                <HugeiconsIcon icon={Pen01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent className="space-x-2" side="bottom">
                <span>Create new issue</span>
                <Kbd>C</Kbd>
              </TooltipContent>
            </Tooltip>
          </SidebarHeader>
          <ContextMenu>
            <ContextMenuTrigger
              className="h-full"
              render={
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {sidebarMenuItems
                          .filter((item) => {
                            const visibility =
                              sidebarConfig[item.title] ??
                              item.visibility ??
                              NavItemVisibility.Show;

                            const isActive = isNavLinkActive(
                              pathname,
                              item.url,
                              activeOrganization?.slug
                            );

                            if (visibility === NavItemVisibility.Badged) {
                              if (isActive) return true;
                              if (item.title === "Drafts" && drafts.length > 0)
                                return true;
                              return false;
                            }

                            return (
                              isActive ||
                              (visibility !== NavItemVisibility.Hide &&
                                visibility !== NavItemVisibility.Auto)
                            );
                          })
                          .map((item) => {
                            const itemUrl = resolveOrgUrl(
                              item.url,
                              activeOrganization?.slug
                            );
                            return (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  item={item}
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
                                  <HugeiconsIcon
                                    icon={item.icon}
                                    strokeWidth={2}
                                  />
                                  <span>{item.title}</span>
                                </SidebarMenuButton>
                                {item.title === "Drafts" &&
                                  drafts.length > 0 && (
                                    <SidebarMenuBadge>
                                      {drafts.length}
                                    </SidebarMenuBadge>
                                  )}
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
              }
            />
            <ContextMenuContent className="w-48">
              {hiddenItems.length > 0 && (
                <React.Fragment>
                  <ContextMenuGroup>
                    {hiddenItems.map((item) => {
                      const itemUrl = resolveOrgUrl(
                        item.url,
                        activeOrganization?.slug
                      );
                      return (
                        <ContextMenuItem
                          key={item.title}
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
                        </ContextMenuItem>
                      );
                    })}
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                </React.Fragment>
              )}
              <ContextMenuGroup>
                <ContextMenuItem
                  className="w-full"
                  nativeButton
                  render={<DialogTrigger handle={sidebarCustomizationHandle} />}
                >
                  <HugeiconsIcon icon={TabletPenIcon} strokeWidth={2} />
                  <span>Customize sidebar</span>
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </React.Fragment>
      )}
    </Sidebar>
  );
}
