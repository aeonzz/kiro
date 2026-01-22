import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import { Portal } from "./portal";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface ActionBarProps {
  children: React.ReactNode;
  container?: Element | DocumentFragment | null;
}

export function ActionBar({ children, container }: ActionBarProps) {
  return <Portal container={container}>{children}</Portal>;
}

export function ActionBarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="toolbar"
      className={cn(
        "bg-popover shadow-border absolute bottom-6 left-1/2 flex w-fit -translate-x-1/2 items-center gap-2 rounded-md p-2",
        className
      )}
      {...props}
    />
  );
}

export function ActionBarClose({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      variant="outline"
      size="icon-xs"
      className={cn("shrink-0", className)}
      {...props}
    >
      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
      <span className="sr-only">Close</span>
    </Button>
  );
}

export function ActionBarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      orientation="vertical"
      className={cn("my-0.5", className)}
      {...props}
    />
  );
}
