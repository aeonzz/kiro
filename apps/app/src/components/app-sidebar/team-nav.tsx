import React from "react";
import {
  ArrowDown01Icon,
  Link04Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import type { Team } from "better-auth/plugins";

import { sidebarTeamItems, sidebarTeamOptions } from "@/config/nav";
import { isNavLinkActive, resolveOrgUrl } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { usePreferencesStore } from "@/hooks/use-preference-store";

import { useOrganization } from "../organization-context";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

interface TeamNavProps extends React.ComponentProps<typeof SidebarGroup> {
  pathname: string;
  teams: Team[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeOrganizationSlug?: string;
}

export function TeamNav({
  teams,
  pathname,
  open,
  onOpenChange,
  activeOrganizationSlug,
  ...props
}: TeamNavProps) {
  const [, copy] = useCopyToClipboard();
  const { activeOrganization } = useOrganization();
  const expandedTeams = usePreferencesStore((state) => state.expandedTeams);
  const setTeamExpanded = usePreferencesStore((state) => state.setTeamExpanded);

  const transitionDuration = `${Math.max(150, Math.min(500, 150 + teams.length * 30))}ms`;
  const style = {
    "--transition-duration": transitionDuration,
  } as React.CSSProperties;

  return (
    <SidebarGroup {...props} style={style}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="group/menu-header">
            <Collapsible open={open} onOpenChange={onOpenChange}>
              <CollapsibleTrigger
                data-sidebar="menu-button"
                data-size="sm"
                className="text-muted-foreground hover:text-muted-foreground aria-expanded:text-muted-foreground peer/menu-button w-full justify-start aria-expanded:bg-transparent data-panel-open:[&>svg]:rotate-0"
                render={<Button variant="ghost" size="sm" />}
              >
                <span>Your teams</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="ease-out-expo -rotate-90 transition-all"
                  style={{ transitionDuration }}
                />
              </CollapsibleTrigger>
              <SidebarMenuAction
                showOnHover
                className="group-hover/menu-header:opacity-100 md:group-hover/menu-header:opacity-100"
                render={
                  <Link
                    to="/$organization/settings/new-team"
                    params={{
                      organization: activeOrganizationSlug ?? "",
                    }}
                  />
                }
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                <span className="sr-only">Create a team</span>
              </SidebarMenuAction>
              <CollapsibleContent style={{ transitionDuration }}>
                <SidebarMenuSub className="transition-opacity duration-300 ease-out group-data-ending-style:opacity-0 group-data-starting-style:opacity-0">
                  {teams.map((team) => (
                    <SidebarMenuSubItem key={team.id}>
                      <Collapsible
                        open={expandedTeams[team.id] ?? false}
                        onOpenChange={(open) => setTeamExpanded(team.id, open)}
                      >
                        <CollapsibleTrigger
                          data-sidebar="menu-button"
                          data-size="sm"
                          className="[&_svg]:text-muted-foreground peer/menu-button w-full justify-start pr-8 font-medium aria-expanded:bg-transparent data-panel-open:[&>svg]:rotate-0"
                          render={<Button variant="ghost" size="sm" />}
                        >
                          <div className="bg-muted mr-1 rounded-sm p-0.5">
                            <HugeiconsIcon
                              icon={User02FreeIcons}
                              strokeWidth={2}
                            />
                          </div>
                          <span>{team.name}</span>
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            strokeWidth={2}
                            className="ease-out-expo -rotate-90 transition-all"
                          />
                        </CollapsibleTrigger>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<SidebarMenuAction showOnHover />}
                          >
                            <HugeiconsIcon
                              icon={MoreHorizontalIcon}
                              strokeWidth={2}
                            />
                            <span className="sr-only">Options</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-52">
                            <DropdownMenuGroup>
                              {sidebarTeamOptions.map((item) => (
                                <DropdownMenuItem key={item.title}>
                                  <HugeiconsIcon
                                    icon={item.icon}
                                    strokeWidth={2}
                                  />
                                  <span>{item.title}</span>
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuItem
                                onClick={() =>
                                  copy(
                                    `${window.location.origin}${resolveOrgUrl(
                                      "/$organization/teams",
                                      activeOrganization?.slug
                                    )}`
                                  )
                                }
                              >
                                <HugeiconsIcon
                                  icon={Link04Icon}
                                  strokeWidth={2}
                                />
                                <span>Copy link</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <span>Leave team</span>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <CollapsibleContent className="duration-450">
                          <SidebarMenuSub className="translate-x-1 pb-2 transition-opacity duration-300 ease-out group-data-ending-style:opacity-0 group-data-starting-style:opacity-0">
                            {sidebarTeamItems.map((item) => (
                              <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                  item={item}
                                  isActive={isNavLinkActive(
                                    pathname,
                                    item.url,
                                    activeOrganizationSlug,
                                    team.name
                                  )}
                                  size="sm"
                                  className="pl-6"
                                  render={
                                    <Link
                                      to={resolveOrgUrl(
                                        item.url,
                                        activeOrganizationSlug,
                                        team.name
                                      )}
                                    />
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={item.icon}
                                    strokeWidth={2}
                                  />
                                  <span>{item.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
