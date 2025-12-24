import * as React from "react";
import {
  ArrowDown01Icon,
  MoreHorizontalIcon,
  TabletPenIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";

import { NavItemVisibility, sidebarWorkspaceItems } from "@/config/nav";
import { isNavLinkActive, resolveOrgUrl } from "@/lib/utils";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import { DialogTrigger } from "@/components/ui/dialog";

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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { sidebarCustomizationHandle } from "./sidebar-control";

interface WorkspaceNavProps extends React.ComponentProps<typeof SidebarGroup> {
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeOrganizationSlug?: string;
}

export function WorkspaceNav({
  pathname,
  open,
  onOpenChange,
  activeOrganizationSlug,
  ...props
}: WorkspaceNavProps) {
  const sidebarConfig = usePreferencesStore((state) => state.sidebarConfig);

  const hasVisibleItems = sidebarWorkspaceItems.some((item) => {
    const visibility =
      sidebarConfig[item.title] ?? item.visibility ?? NavItemVisibility.Show;
    return visibility !== NavItemVisibility.Hide;
  });

  if (!hasVisibleItems) {
    return null;
  }

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
                <span>Workspace</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="ease-out-expo -rotate-90 transition-all"
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="transition-opacity duration-300 ease-out group-data-ending-style:opacity-0 group-data-starting-style:opacity-0">
                  {sidebarWorkspaceItems
                    .filter((item) => {
                      const visibility =
                        sidebarConfig[item.title] ??
                        item.visibility ??
                        NavItemVisibility.Show;

                      const isActive = isNavLinkActive(
                        pathname,
                        item.url,
                        activeOrganizationSlug
                      );

                      return (
                        isActive ||
                        (visibility !== NavItemVisibility.Hide &&
                          visibility !== NavItemVisibility.Auto)
                      );
                    })
                    .map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuButton
                          item={item}
                          isActive={isNavLinkActive(
                            pathname,
                            item.url,
                            activeOrganizationSlug
                          )}
                          size="sm"
                          render={
                            <Link
                              to={resolveOrgUrl(
                                item.url,
                                activeOrganizationSlug
                              )}
                            />
                          }
                        >
                          <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  {sidebarWorkspaceItems.some((item) => {
                    const visibility =
                      sidebarConfig[item.title] ??
                      item.visibility ??
                      NavItemVisibility.Show;

                    return visibility === NavItemVisibility.Auto;
                  }) &&
                    sidebarWorkspaceItems.some((item) => {
                      const visibility =
                        sidebarConfig[item.title] ??
                        item.visibility ??
                        NavItemVisibility.Show;

                      const isActive = isNavLinkActive(
                        pathname,
                        item.url,
                        activeOrganizationSlug
                      );

                      return !isActive && visibility === NavItemVisibility.Auto;
                    }) && (
                      <SidebarMenuSubItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<SidebarMenuButton size="sm" />}
                          >
                            <HugeiconsIcon
                              icon={MoreHorizontalIcon}
                              strokeWidth={2}
                            />
                            <span>More</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48">
                            <DropdownMenuGroup>
                              {sidebarWorkspaceItems
                                .filter((item) => {
                                  const visibility =
                                    sidebarConfig[item.title] ??
                                    item.visibility ??
                                    NavItemVisibility.Show;

                                  const isActive = isNavLinkActive(
                                    pathname,
                                    item.url,
                                    activeOrganizationSlug
                                  );

                                  return (
                                    !isActive &&
                                    visibility === NavItemVisibility.Auto
                                  );
                                })
                                .map((item) => (
                                  <DropdownMenuItem
                                    key={item.title}
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
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                className="w-full"
                                nativeButton
                                render={
                                  <DialogTrigger
                                    handle={sidebarCustomizationHandle}
                                  />
                                }
                              >
                                <HugeiconsIcon
                                  icon={TabletPenIcon}
                                  strokeWidth={2}
                                />
                                <span>Customize sidebar</span>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuSubItem>
                    )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
