import * as React from "react";
import { AlertSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ListBoxItem } from "@/components/ui/list-box";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InProgressIcon } from "@/components/icons";

interface IssueCardProps {
  item: {
    id: string;
    label: string;
  };
  index: number;
  isSelected: boolean;
  toggleId: (id: string) => void;
}

export function IssueCard({
  isSelected,
  index,
  toggleId,
  item,
}: IssueCardProps) {
  const { organization } = useParams({ from: "/_app/$organization" });

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <ListBoxItem
            index={index}
            isSelected={isSelected}
            className={cn(
              "data-active:not-data-selected:bg-muted dark:data-active:not-data-selected:bg-muted/50 data-active:text-foreground data-[kb-visible=true]:ring-ring/50 [&_svg]:text-muted-foreground data-selected:bg-muted dark:not-data-selected:data-popup-open:bg-muted/50 not-data-selected:data-popup-open:bg-muted flex h-11 items-center justify-between gap-3 px-2 py-1.5 text-sm outline-none select-none data-[kb-visible=true]:ring-1 data-[kb-visible=true]:ring-inset [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            )}
            render={
              <Link
                to="/$organization/issue/$id"
                params={{ organization, id: item.id }}
                state={(prev: any) => ({ ...prev, viewMode: "full" })}
              />
            }
          />
        }
      >
        <div className="flex items-center gap-2">
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleId(item.id)}
                    tabIndex={-1}
                    className={cn(
                      "opacity-0 group-data-active/list-box-item:opacity-100 group-data-popup-open/list-box-item:opacity-100",
                      isSelected && "opacity-100"
                    )}
                  />
                }
              />
              <TooltipContent className="space-x-1.5" side="bottom">
                <span>Clear</span>
                <KbdGroup>
                  <Kbd>X</Kbd>
                </KbdGroup>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={AlertSquareIcon} strokeWidth={2} />
            <span className="text-xs-plus text-muted-foreground leading-none tracking-wide">
              {item.id}
            </span>
            <InProgressIcon className="size-4 text-yellow-500!" />
            <span className="text-xs-plus leading-none font-medium tracking-wide">
              {item.label}
            </span>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-52">
        <ContextMenuGroup>
          <ContextMenuItem>asdasd</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
