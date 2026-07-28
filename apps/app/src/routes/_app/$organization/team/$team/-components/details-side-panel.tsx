import * as React from "react";

import { SidePanel } from "@/components/ui/side-panel";

export function DetailsSidePanel({
  children,
  isOpen,
  width = "350px",
  ...props
}: React.ComponentProps<typeof SidePanel>) {
  return (
    <SidePanel
      isOpen={isOpen}
      id="details-panel"
      side="right"
      width={width}
      {...props}
    >
      <div className="p-4">{children}</div>
    </SidePanel>
  );
}
