import * as React from "react";
import type { StrictOmit } from "@/types";
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { ArrowDownIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props) {
  return (
    <ToolbarPrimitive.Root
      className={cn("relative flex items-center select-none", className)}
      {...props}
    />
  );
}

export function ToolbarToggleGroup({
  className,
  ...props
}: ToolbarPrimitive.Group.Props) {
  return (
    <ToolbarPrimitive.Group
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export function ToolbarLink({
  className,
  ...props
}: ToolbarPrimitive.Link.Props) {
  return (
    <ToolbarPrimitive.Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  );
}

export function ToolbarSeparator({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) {
  return (
    <ToolbarPrimitive.Separator
      className={cn("bg-border mx-2 my-1 w-px shrink-0", className)}
      {...props}
    />
  );
}

type ToolbarButtonProps = {
  isDropdown?: boolean;
  tooltip?: React.ReactNode;
  tooltipContentProps?: StrictOmit<
    React.ComponentPropsWithoutRef<typeof TooltipContent>,
    "children" | "side"
  >;
  tooltipProps?: StrictOmit<
    React.ComponentPropsWithoutRef<typeof Tooltip>,
    "children"
  >;
  tooltipTriggerProps?: React.ComponentPropsWithoutRef<typeof TooltipTrigger>;
} & StrictOmit<React.ComponentPropsWithoutRef<typeof Button>, "value">;

export function ToolbarButton({
  children,
  isDropdown,
  size = "sm",
  tooltip,
  tooltipContentProps,
  tooltipProps,
  tooltipTriggerProps,
  variant = "ghostPopup",
  className,
  ...props
}: ToolbarButtonProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <ToolbarPrimitive.Button
      render={
        <Button
          variant={variant}
          size={size}
          className={cn("gap-px pr-1.5", className)}
          {...props}
        />
      }
    >
      {isDropdown ? (
        <React.Fragment>
          <div className="flex flex-1 items-center whitespace-nowrap">
            {children}
          </div>
          <HugeiconsIcon
            icon={ArrowDownIcon}
            strokeWidth={2}
            className="text-muted-foreground size-3.5"
          />
        </React.Fragment>
      ) : (
        children
      )}
    </ToolbarPrimitive.Button>
  );

  if (tooltip && mounted) {
    return (
      <Tooltip {...tooltipProps}>
        <TooltipTrigger {...tooltipTriggerProps} render={content} />

        <TooltipContent side="top" {...tooltipContentProps}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function ToolbarGroup({
  children,
  className,
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/toolbar-group",
        "relative hidden cursor-auto has-[button]:flex",
        className
      )}
    >
      <div className="flex items-center gap-1">{children}</div>

      <div className="mx-1.5 py-0.5 group-last/toolbar-group:hidden!">
        <Separator orientation="vertical" />
      </div>
    </div>
  );
}
