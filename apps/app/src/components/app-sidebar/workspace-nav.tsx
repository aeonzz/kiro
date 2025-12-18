import * as React from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";

import { sidebarWorkspaceItems } from "@/config/nav";
import { isNavLinkActive, resolveOrgUrl } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";

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
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible open={open} onOpenChange={onOpenChange}>
            <SidebarMenuItem className="group/menu-header">
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
                <SidebarMenuSub>
                  {sidebarWorkspaceItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isNavLinkActive(
                          pathname,
                          item.url,
                          activeOrganizationSlug
                        )}
                        size="sm"
                        render={
                          <Link
                            to={resolveOrgUrl(item.url, activeOrganizationSlug)}
                          />
                        }
                      >
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
