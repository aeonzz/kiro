"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delay = 800,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      disableHoverablePopup
      {...props}
    />
  );
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  collisionBoundary,
  collisionPadding,
  collisionAvoidance = {
    side: "none",
  },
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "collisionBoundary"
    | "collisionPadding"
    | "collisionAvoidance"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionBoundary ? 0 : collisionPadding}
        collisionAvoidance={collisionAvoidance}
        className="ease-out-expo isolate h-(--positioner-height) max-h-[--available-height] w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] duration-400"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "bg-popover text-popover-foreground shadow-border ease-out-expo text-micro-plus relative h-(--popup-height,auto) max-h-[--available-height] w-(--popup-width,auto) max-w-[--available-width] origin-(--transform-origin) rounded-md px-2 py-1 transition-[width,height,opacity,scale] duration-400",
            "data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
