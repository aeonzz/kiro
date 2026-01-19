import * as React from "react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { inboxDeleteOptions } from "@/config/inbox";
import { useInboxFilters } from "@/hooks/use-inbox-filter-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ContainerHeader } from "@/components/container";
import { useOrganization } from "@/components/organization-context";

import { InboxDisplayOptions } from "./inbox-display-options";
import { InboxFilterMenu } from "./inbox-filter-menu";

export function InboxHeader({
  ...props
}: React.ComponentProps<typeof ContainerHeader>) {
  const { activeOrganization } = useOrganization();
  const { filters } = useInboxFilters(activeOrganization?.id);

  return (
    <ContainerHeader {...props}>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <SidebarTrigger />
          <h2>Inbox</h2>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                />
              }
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-fit">
              <DropdownMenuGroup>
                {inboxDeleteOptions.map((option) => (
                  <DropdownMenuItem key={option.value}>
                    <HugeiconsIcon icon={option.icon} strokeWidth={2} />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1">
          {filters.length === 0 && <InboxFilterMenu />}
          <InboxDisplayOptions />
        </div>
      </div>
    </ContainerHeader>
  );
}
