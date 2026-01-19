import React from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "./ui/scroll-area";

function Container({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="container"
      className={cn("relative flex h-full flex-col overflow-hidden", className)}
      {...props}
    />
  );
}

function ContainerHeader({
  className,
  inset,
  ...props
}: React.ComponentProps<"header"> & { inset?: boolean }) {
  return (
    <header
      data-inset={inset}
      data-slot="header"
      className={cn(
        "border-b-border text-xs-plus flex h-10 items-center gap-1 border-b px-2 py-1.5 font-semibold data-inset:px-8",
        className
      )}
      {...props}
    />
  );
}

function ContainerContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <ScrollArea
      className={cn(
        "h-full min-h-0 flex-1 **:data-[slot=scroll-area-viewport]:focus-visible:ring-0 **:data-[slot=scroll-area-viewport]:focus-visible:outline-0",
        className
      )}
    >
      <div data-slot="content" className={cn("h-full", className)} {...props}>
        {children}
      </div>
    </ScrollArea>
  );
}

export { Container, ContainerHeader, ContainerContent };
