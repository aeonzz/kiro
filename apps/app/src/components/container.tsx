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
  setContainer,
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<"header"> & {
  inset?: boolean;
  setContainer?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <header
      data-inset={inset}
      data-slot="header"
      className="group/header border-b-border text-xs-plus h-10 w-full border-b font-semibold"
      {...props}
    >
      <div
        ref={setContainer}
        className={cn(
          "mx-2 flex items-center gap-1 py-1.5 group-data-inset/header:mx-6",
          className
        )}
      >
        {children}
      </div>
    </header>
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
