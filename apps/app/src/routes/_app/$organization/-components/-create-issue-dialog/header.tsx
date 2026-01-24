import * as React from "react";
import type { StrictOmit } from "@/types";
import {
  ArrowExpand01Icon,
  ArrowShrink02Icon,
  Cancel01Icon,
  GreaterThanIcon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps extends StrictOmit<
  React.ComponentProps<typeof DialogHeader>,
  "children"
> {
  expand: boolean;
  setExpand: (expand: boolean) => void;
}

export function Header({
  className,
  expand,
  setExpand,
  ...props
}: HeaderProps) {
  return (
    <DialogHeader
      className={cn(
        "h-fit flex-row items-center justify-between px-3! pt-3! pb-1",
        className
      )}
      {...props}
    >
      <DialogTitle className="sr-only">Create Issue</DialogTitle>
      <div className="flex items-center gap-1.5">
        <Select defaultValue="team1">
          <Tooltip>
            <TooltipTrigger
              render={<SelectTrigger size="xs" hideIcon className="pl-1" />}
            >
              <div className="bg-muted shadow-border-sm size-4 rounded-sm p-0.5">
                <HugeiconsIcon
                  icon={User02FreeIcons}
                  strokeWidth={2}
                  className="size-3"
                />
              </div>
              <SelectValue placeholder="Select a team" />
            </TooltipTrigger>
            <TooltipContent className="space-x-2" side="bottom">
              <span>Set team</span>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>⇧</Kbd>
                <Kbd>M</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
          <SelectContent
            alignItemWithTrigger={false}
            align="start"
            className="w-44"
          >
            <SelectGroup>
              <SelectItem value="team1">Team 1</SelectItem>
              <SelectItem value="team2">Team 2</SelectItem>
              <SelectItem value="team3">Team 3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <HugeiconsIcon
          icon={GreaterThanIcon}
          strokeWidth={2}
          className="size-2.5"
        />
        <span className="text-xs-plus leading-4 font-normal">New Issue</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setExpand(!expand)}
              />
            }
          >
            <HugeiconsIcon
              icon={expand ? ArrowShrink02Icon : ArrowExpand01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          </TooltipTrigger>
          <TooltipContent className="space-x-2" side="bottom">
            <span>{expand ? "Collapse" : "Expand"}</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>F</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <DialogClose render={<Button variant="ghost" size="icon-sm" />} />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close</span>
          </TooltipTrigger>
          <TooltipContent className="space-x-2" side="bottom">
            <span>Close</span>
            <Kbd>Escape</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </DialogHeader>
  );
}
