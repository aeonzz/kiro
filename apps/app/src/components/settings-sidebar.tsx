import * as React from "react";
import {
  ArrowLeft01Icon,
  PlusSignIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "@tanstack/react-router";

import { settingsNavItems } from "@/config/nav";
import { isNavLinkActive, resolveOrgUrl } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { BackButton } from "./back-button";
import { useOrganization } from "./organization-context";

interface SettingsSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isPending?: boolean;
}

export function SettingsSidebar({
  isPending,
  variant = "inset",
  ...props
}: SettingsSidebarProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const { activeOrganization, teams } = useOrganization();

  return (
    <Sidebar variant={variant} {...props}>
      {!isPending && (
        <React.Fragment>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <BackButton
                  to="/$organization/inbox"
                  variant="ghost"
                  className="text-muted-foreground w-fit"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
                  <span>Back</span>
                </BackButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {settingsNavItems.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
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
            ))}
            <SidebarGroup>
              <SidebarGroupLabel>Teams</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {teams.map((team) => {
                    return (
                      <SidebarMenuItem key={team.id}>
                        <SidebarMenuButton
                          size="sm"
                          className="[&_svg]:text-muted-foreground font-semibold"
                          isActive={isNavLinkActive(
                            pathname,
                            "/$organization/settings/administration/teams/$name",
                            activeOrganization?.slug,
                            team.slug
                          )}
                          render={
                            <Link
                              to="/$organization/settings/administration/teams/$name"
                              params={{
                                organization: activeOrganization?.slug ?? "",
                                name: team.slug,
                              }}
                            />
                          }
                        >
                          <div className="bg-muted rounded-sm p-0.5">
                            <HugeiconsIcon icon={User02Icon} strokeWidth={2} />
                          </div>
                          <span>{team.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="sm"
                      className="text-muted-foreground"
                      render={
                        <Link
                          to="/$organization/settings/new-team"
                          params={{
                            organization: activeOrganization?.slug ?? "",
                          }}
                        />
                      }
                    >
                      <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                      <span>Create a team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </React.Fragment>
      )}
    </Sidebar>
  );
}
