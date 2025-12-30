import * as React from "react";
import {
  Delete02Icon,
  MoreHorizontalIcon,
  Settings01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";

import type { Team } from "@/types/schema-types";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { teamDeleteAlertDialogHandle } from "./delete-alert-dialog";

interface ActionsProps {
  row: Row<Team>;
}

export function TeamActionItems({
  row,
  isContext,
}: {
  row: Row<Team>;
  isContext?: boolean;
}) {
  const { organization } = useParams({
    from: "/_app/$organization",
  });

  const { id, slug, name } = row.original;
  const Item = isContext ? ContextMenuItem : DropdownMenuItem;

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
          Settings
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-40">
            <Item
              render={
                <Link
                  to="/$organization/settings/teams/$name/members"
                  params={{
                    organization,
                    name: slug,
                  }}
                />
              }
            >
              <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
              Members
            </Item>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <Item
        className="w-full"
        nativeButton
        render={
          <AlertDialogTrigger
            handle={teamDeleteAlertDialogHandle}
            payload={{ name, id }}
          />
        }
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        Delete
      </Item>
    </DropdownMenuGroup>
  );
}

export function Actions({ row }: ActionsProps) {
  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="opacity-0 group-hover/row:opacity-100 group-data-popup-open/row:opacity-100 data-popup-open:opacity-100"
            />
          }
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
          <span className="sr-only">More options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <TeamActionItems row={row} />
        </DropdownMenuContent>
      </DropdownMenu>
    </React.Fragment>
  );
}
