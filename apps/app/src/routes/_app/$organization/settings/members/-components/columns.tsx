import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Organization } from "@/types/schema-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { TableColumnHeader } from "../../../../../../components/settings/table-column-header";
import { Actions } from "./actions";

export const columns: ColumnDef<Organization["members"][number]>[] = [
  {
    id: "name",
    accessorKey: "user.name",
    meta: {
      className: "w-full",
    },
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Name" showDefaultArrow />
    ),
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
    id: "email",
    accessorKey: "user.email",
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="text-xs-plus text-muted-foreground font-normal">
        {row.original.user.email}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-xs-plus text-muted-foreground font-normal">
          {format(row.original.createdAt, "MMMM d")}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    meta: {
      isInteractive: true,
    },
    header: () => <div className="w-8" />,
    cell: ({ row }) => <Actions row={row} />,
  },
];
