import * as React from "react";
import {
  ArrowUpDownIcon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { orderingOptions, showItemsToggleOptions } from "@/config/inbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InboxDisplayOptions({
  ...props
}: React.ComponentProps<typeof Popover>) {
  return (
    <Popover {...props}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="[&_svg:not([class*='size-'])]:size-4"
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent>
          <span>Show display options</span>
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" flush>
        <div className="border-border flex items-center justify-between gap-2 border-b px-4 py-3">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={ArrowUpDownIcon}
              strokeWidth={2}
              className="text-muted-foreground size-4"
            />
            <Label
              htmlFor="ordering"
              className="text-muted-foreground text-xs font-normal"
            >
              Ordering
            </Label>
          </div>
          <Select items={orderingOptions} defaultValue={orderingOptions[0]}>
            <SelectTrigger id="ordering" className="w-24" size="xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              className="min-w-(--anchor-width)"
            >
              <SelectGroup className="*:data-[slot=select-item]:py-1">
                {orderingOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="*:data-[slot=select-item-indicator]:right-1"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4 px-4 py-3">
          {showItemsToggleOptions.map((option) => (
            <div className="flex items-start gap-3">
              <Label
                htmlFor={option.value}
                className="text-muted-foreground text-xs font-normal"
              >
                {option.label}
              </Label>
              <div className="flex flex-1 items-center justify-end">
                <Switch id={option.value} size="sm" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-border border-t px-4 py-3">
          <div className="space-y-2.5">
            <Label
              htmlFor="ordering"
              className="text-muted-foreground text-xs font-normal"
            >
              Ordering
            </Label>
            <div className="*:not-data-pressed:text-muted-foreground flex items-center gap-1">
              <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
                ID
              </Toggle>

              <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
                Status and icon
              </Toggle>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
