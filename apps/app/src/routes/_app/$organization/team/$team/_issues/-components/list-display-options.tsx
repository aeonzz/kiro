import * as React from "react";
import { SlidersHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListDisplayOptionsProps extends React.ComponentProps<
  typeof Popover
> {}

export function ListDisplayOptions({ ...props }: ListDisplayOptionsProps) {
  return (
    <Popover {...props}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger render={<Button variant="outline" size="xs" />} />
          }
        >
          <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} />
          <span>Display</span>
        </TooltipTrigger>
        <TooltipContent className="space-x-2" side="bottom" align="end">
          <span>Show display options</span>
          <KbdGroup>
            <Kbd>⇧</Kbd>
            <Kbd>V</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" flush></PopoverContent>
    </Popover>
  );
}
