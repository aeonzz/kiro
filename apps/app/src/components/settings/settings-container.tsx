import * as React from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "../ui/scroll-area";

export default function SettingsContainer({
  type = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  type?: "default" | "table";
}) {
  return (
    <ScrollArea className="h-full min-h-0 **:data-[slot=scroll-area-viewport]:focus-visible:ring-0 **:data-[slot=scroll-area-viewport]:focus-visible:outline-0">
      <main
        data-type={type}
        data-slot="settings-container"
        className={cn(
          "group flex items-center justify-center px-8 py-8 data-[type=table]:px-0 md:py-16",
          className
        )}
        {...props}
      >
        <div className="w-full max-w-2xl space-y-8 group-data-[type=table]:max-w-full **:data-[slot=back-button]:absolute **:data-[slot=back-button]:top-2 **:data-[slot=back-button]:left-2">
          {children}
        </div>
      </main>
    </ScrollArea>
  );
}
