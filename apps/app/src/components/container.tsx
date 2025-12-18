import React from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "./ui/scroll-area";

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("relative overflow-hidden", className)}
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
        "border-b-border text-xs-plus flex h-10 items-center space-x-1.5 border-b px-2 py-1.5 font-semibold",
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
    <ScrollArea className="h-full min-h-0 **:data-[slot=scroll-area-viewport]:focus-visible:ring-0 **:data-[slot=scroll-area-viewport]:focus-visible:outline-0">
      <main data-slot="content" className={cn("", className)} {...props}>
        {children}
      </main>
    </ScrollArea>
  );
}

export { Container, ContainerHeader, ContainerContent };
