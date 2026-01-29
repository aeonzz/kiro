import * as React from "react";
import {
  ArrowUpDownIcon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { displayOptions, orderingOptions } from "@/config/inbox";
import { useActiveInboxDisplayOptions } from "@/hooks/use-inbox-display-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  OptionControlSelect,
  OptionControlSwitch,
} from "@/components/option-control";

export function InboxDisplayOptions({
  ...props
}: React.ComponentProps<typeof Popover>) {
  const {
    ordering,
    showSnoozedItems,
    showReadItems,
    showUnreadFirst,
    displayProperties,
    setOrdering,
    setShowSnoozedItems,
    setShowReadItems,
    setShowUnreadFirst,
    setDisplayProperties,
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
        <div className="border-border space-y-2 border-b px-4 py-3">
          <OptionControlSelect
            id="ordering"
            label="Ordering"
            icon={ArrowUpDownIcon}
            options={orderingOptions}
            value={selectedOrdering}
            onValueChange={(value) => {
              setOrdering(value.value);
            }}
          />
        </div>
        <div className="space-y-2 px-4 py-3">
          <OptionControlSwitch
            id="show-snoozed-items"
            label="Show snoozed items"
            checked={showSnoozedItems}
            onCheckedChange={setShowSnoozedItems}
          />
          <OptionControlSwitch
            id="show-read-items"
            label="Show read items"
            checked={showReadItems}
            onCheckedChange={setShowReadItems}
          />
          {showReadItems && (
            <OptionControlSwitch
              id="show-unread-first"
              label="Show unread first"
              checked={showUnreadFirst}
              onCheckedChange={setShowUnreadFirst}
            />
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
            <ToggleGroup
              value={displayProperties}
              onValueChange={(val) => setDisplayProperties(val as string[])}
              size="xs"
              variant="outline"
              className="flex-wrap"
              multiple
              spacing={1.5}
            >
              {displayOptions.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
