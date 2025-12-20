import * as React from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "./ui/scroll-area";

interface SettingsContainerProps extends React.ComponentProps<"div"> {}

export default function SettingsContainer({
  className,
  children,
  ...props
}: SettingsContainerProps) {
  return (
    <ScrollArea className="h-full min-h-0 **:data-[slot=scroll-area-viewport]:focus-visible:ring-0 **:data-[slot=scroll-area-viewport]:focus-visible:outline-0">
      <main
        data-slot="settings-container"
        className={cn(
          "flex items-center justify-center px-8 py-8 md:py-16",
          className
        )}
        {...props}
      >
        <div className="w-full max-w-2xl space-y-8">{children}</div>
      </main>
    </ScrollArea>
  );
}
