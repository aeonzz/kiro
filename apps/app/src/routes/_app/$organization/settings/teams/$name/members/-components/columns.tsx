import React from "react";
import {
  ArrowUpDownIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ColumnDef } from "@tanstack/react-table";

import { Team } from "@/types/schema-types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Actions } from "./actions";

export const columns: ColumnDef<Team["teammembers"][number]>[] = [
  {
    accessorKey: "user.name",
    meta: {
      className: "w-full",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <HugeiconsIcon icon={ArrowUpDownIcon} strokeWidth={2} />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarImage src={row.original.user.image ?? ""} />
            <AvatarFallback>
              {row.original.user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-normal">{row.original.user.name}</div>
            <div className="text-muted-foreground text-xs leading-none">
              {row.original.user.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <HugeiconsIcon icon={ArrowUpDownIcon} strokeWidth={2} />
        </Button>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="w-8" />;
    },
    cell: ({ row }) => <Actions row={row} />,
  },
];
