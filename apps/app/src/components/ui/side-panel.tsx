import * as React from "react";

import { cn } from "@/lib/utils";

interface SidePanelProps extends React.ComponentProps<"aside"> {
  side?: "left" | "right";
  isOpen: boolean;
  width?: string;
}

export function SidePanel({
  className,
  side = "right",
  width = "450px",
  isOpen,
  children,
  ...props
}: SidePanelProps) {
  return (
    <aside
      data-side={side}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "bg-background ease-out-expo border-border relative h-full overflow-hidden transition-all duration-300",
        "data-[state=closed]:w-0 data-[state=open]:w-(--side-panel-width)",
        side === "right"
          ? "data-[state=open]:border-l"
          : "data-[state=open]:border-r",
        className
      )}
      style={
        {
          "--side-panel-width": width,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="h-full w-(--side-panel-width) overflow-y-auto">
        {children}
      </div>
    </aside>
  );
}
