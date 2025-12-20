import * as React from "react";
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { useAuthenticatedSession } from "@/hooks/use-session";

import { useOrganization } from "../organization-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { OrganizationList } from "./organization-list";

export function UserMenu() {
  const navigate = useNavigate();
  const session = useAuthenticatedSession();
  const { activeOrganization } = useOrganization();

  const [open, setOpen] = React.useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            className="w-fit max-w-full"
            render={<SidebarMenuButton />}
          >
            <Avatar className="size-5 after:rounded-sm">
              <AvatarImage
                src={activeOrganization?.logo ?? undefined}
                alt={activeOrganization?.name ?? ""}
              />
              <AvatarFallback className="rounded-sm text-[9.5px] leading-none">
                {activeOrganization?.name?.slice(0, 2).toUpperCase() ?? "??"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs-plus min-w-0 flex-1 truncate leading-none font-semibold">
              {activeOrganization?.name}
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="ml-auto"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[232px]"
            align="start"
            alignOffset={0}
          >
            <DropdownMenuItem
              render={
                <Link
                  to="/$organization/settings/account/preferences"
                  params={{
                    organization: activeOrganization?.slug ?? "",
                  }}
                />
              }
            >
              <span>Settings</span>
              <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Keyboard shortcuts</span>
              <DropdownMenuShortcut>⌘?</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                render={
                  <DropdownMenuItem className="data-popup-open:[&_svg]:text-accent-foreground">
                    Switch workspace
                    <span className="ml-auto flex gap-1">
                      <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
                      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
                    </span>
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSubContent className="min-w-52" side="right">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{session?.user.email}</DropdownMenuLabel>
                  <OrganizationList setOpen={setOpen} />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<Link to="/join">Create Organization</Link>}
                  />
                  <DropdownMenuItem>
                    <span>Add an account...</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      navigate({
                        to: "/login",
                        reloadDocument: true,
                      });
                    },
                    onError: () => {
                      toast.error("Failed to sign out");
                    },
                  },
                })
              }
            >
              Log out
              <DropdownMenuShortcut>⌘⇧L</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
