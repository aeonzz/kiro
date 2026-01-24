import * as React from "react";
import type { StrictOmit } from "@/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FooterProps extends StrictOmit<
  React.ComponentProps<typeof DialogFooter>,
  "children"
> {
  className?: string;
}

export function Footer({ className, ...props }: FooterProps) {
  return (
    <DialogFooter className={cn("mt-auto p-3.5", className)} {...props}>
      <Tooltip>
        <TooltipTrigger render={<Button size="sm" className="px-4" />}>
          <span>Create issue</span>
        </TooltipTrigger>
        <TooltipContent
          className="flex flex-col gap-1.5"
          collisionAvoidance={{
            side: "flip",
          }}
        >
          <div className="space-x-2">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
            <span>to save issue</span>
          </div>
          <div className="space-x-2">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Alt</Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
            <span>to save and open issue</span>
          </div>
          <div className="space-x-2">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
            <span>to save and draft new</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </DialogFooter>
  );
}
