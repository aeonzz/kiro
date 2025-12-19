import React from "react";
import {
  ArrowDown01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import type { Team } from "better-auth/plugins";

import { sidebarTeamItems, sidebarTeamOptions } from "@/config/nav";
import { isNavLinkActive, resolveOrgUrl } from "@/lib/utils";

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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
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
  return (
    <SidebarGroup {...props}>
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
                <span>Your Teams</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="ease-out-expo -rotate-90 transition-all"
                />
              </CollapsibleTrigger>
              <SidebarMenuAction
                showOnHover
                // tooltip="Create a team"
                className="group-hover/menu-header:opacity-100 md:group-hover/menu-header:opacity-100"
                render={
                  <Link
                    to="/$organization/new-team"
                    params={{
                      organization: activeOrganizationSlug ?? "",
                    }}
                  />
                }
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                <span className="sr-only">Create a team</span>
              </SidebarMenuAction>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {teams.map((team) => (
                    <SidebarMenuSubItem
                      key={team.id}
                      className="ease-out-expo transition-opacity duration-300 group-data-closed:opacity-0 group-data-open:opacity-100"
                    >
                      <Collapsible>
                        <CollapsibleTrigger
                          data-sidebar="menu-button"
                          data-size="sm"
                          className="[&_svg]:text-muted-foreground peer/menu-button w-full justify-start pr-8 text-sm font-medium aria-expanded:bg-transparent data-panel-open:[&>svg]:rotate-0"
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
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {sidebarTeamItems.map((item) => (
                              <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuButton
                                  isActive={isNavLinkActive(
                                    pathname,
                                    item.url,
                                    activeOrganizationSlug
                                  )}
                                  size="sm"
                                  className="pl-6"
                                  render={
                                    <Link
                                      to={resolveOrgUrl(
                                        item.url,
                                        activeOrganizationSlug
                                      )}
                                    />
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={item.icon}
                                    strokeWidth={2}
                                  />
                                  <span>{item.title}</span>
                                </SidebarMenuButton>
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
