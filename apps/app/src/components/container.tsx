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
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn(
        "border-b-border text-xs-plus flex h-10 items-center gap-1 border-b px-2 py-1.5 font-semibold",
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
}: React.ComponentProps<"main">) {
  return (
    <ScrollArea
      className={cn(
        "h-full min-h-0 flex-1 **:data-[slot=scroll-area-viewport]:focus-visible:ring-0 **:data-[slot=scroll-area-viewport]:focus-visible:outline-0",
        className
      )}
    >
      <main data-slot="content" className={cn("h-full", className)} {...props}>
        {children}
      </main>
    </ScrollArea>
  );
}

export { Container, ContainerHeader, ContainerContent };
