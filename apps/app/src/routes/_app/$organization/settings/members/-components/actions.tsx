import * as React from "react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Row } from "@tanstack/react-table";

import type { Organization } from "@/types/schema-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TableRow = Organization["members"][number];

interface ActionsProps {
  row: Row<TableRow>;
}

export function MemberActionItems({
  row,
  isContext,
}: {
  row: Row<TableRow>;
  isContext?: boolean;
}) {
  const Item = isContext ? ContextMenuItem : DropdownMenuItem;

  return (
    <DropdownMenuGroup>
      <Item>Leave organization</Item>
    </DropdownMenuGroup>
  );
}

export function Actions({ row }: ActionsProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={cn(
        "flex items-center gap-2 opacity-0 group-hover/row:opacity-100",
        open && "opacity-100"
      )}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" />}>
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
          <span className="sr-only">More options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <MemberActionItems row={row} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
