import { ArrowDown02Icon, ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Team } from "@/types/schema-types";
import { Button } from "@/components/ui/button";

import { TableColumnHeader } from "../../../../../../components/settings/table-column-header";
import { Actions } from "./actions";

export const columns: ColumnDef<Team>[] = [
  {
    id: "name",
    accessorKey: "name",
    meta: {
      className: "w-full",
    },
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Name" showDefaultArrow />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="text-sm font-normal">{row.original.name}</div>
          <div className="text-muted-foreground text-xs leading-none">
            {row.original.slug}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "members",
    meta: {
      isInteractive: true,
    },
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      const { organization } = useParams({
        from: "/_app/$organization/settings/teams/",
      });

      return (
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          className="text-muted-foreground"
          render={
            <Link
              to="/$organization/settings/teams/$name/members"
              params={{ organization, name: row.original.slug }}
            />
          }
        >
          {row.original.teammembers.length}
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created" />
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
