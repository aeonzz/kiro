import * as React from "react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Row } from "@tanstack/react-table";

import type { Team } from "@/types/schema-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionsProps {
  row: Row<Team["teammembers"][number]>;
}

export function Actions({ row }: ActionsProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={cn(
        "flex items-center gap-2 opacity-0 group-hover/cell:opacity-100",
        open && "opacity-100"
      )}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" />}>
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
          <span className="sr-only">More options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Leave team...</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
