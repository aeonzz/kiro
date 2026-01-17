import * as React from "react";
import {
  ArrowUpDownIcon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { orderingOptions } from "@/config/inbox";
import { useActiveInboxDisplayOptions } from "@/hooks/use-inbox-display-store";
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
  const {
    ordering,
    showSnoozedItems,
    showReadItems,
    showUnreadFirst,
    showId,
    showStatusAndIcon,
    setOrdering,
    setShowSnoozedItems,
    setShowReadItems,
    setShowUnreadFirst,
    setShowId,
    setShowStatusAndIcon,
  } = useActiveInboxDisplayOptions();

  const selectedOrdering = orderingOptions.find((f) => f.value === ordering);

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
          <Select
            value={selectedOrdering}
            itemToStringValue={(item) => item.value}
            onValueChange={(value) => {
              if (!value) return;
              setOrdering(value.value);
            }}
          >
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
                    value={option}
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
          <div className="flex items-start gap-3">
            <Label
              htmlFor="showSnoozedItems"
              className="text-muted-foreground text-xs font-normal"
            >
              Show snoozed items
            </Label>
            <div className="flex flex-1 items-center justify-end">
              <Switch
                id="showSnoozedItems"
                size="sm"
                checked={showSnoozedItems}
                onCheckedChange={setShowSnoozedItems}
              />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Label
              htmlFor="showReadItems"
              className="text-muted-foreground text-xs font-normal"
            >
              Show read items
            </Label>
            <div className="flex flex-1 items-center justify-end">
              <Switch
                id="showReadItems"
                size="sm"
                checked={showReadItems}
                onCheckedChange={setShowReadItems}
              />
            </div>
          </div>
          {showReadItems && (
            <div className="flex items-start gap-3">
              <Label
                htmlFor="showUnreadFirst"
                className="text-muted-foreground text-xs font-normal"
              >
                Show unread first
              </Label>
              <div className="flex flex-1 items-center justify-end">
                <Switch
                  id="showUnreadFirst"
                  size="sm"
                  checked={showUnreadFirst}
                  onCheckedChange={setShowUnreadFirst}
                />
              </div>
            </div>
          )}
        </div>
        <div className="border-border border-t px-4 py-3">
          <div className="space-y-2.5">
            <Label
              htmlFor="rendering"
              className="text-muted-foreground text-xs font-normal"
            >
              Display
            </Label>
            <div className="*:not-data-pressed:text-muted-foreground flex items-center gap-1">
              <Toggle
                size="sm"
                variant="outline"
                pressed={showId}
                onPressedChange={setShowId}
              >
                ID
              </Toggle>

              <Toggle
                size="sm"
                variant="outline"
                pressed={showStatusAndIcon}
                onPressedChange={setShowStatusAndIcon}
              >
                Status and icon
              </Toggle>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
