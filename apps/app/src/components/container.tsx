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
      className="group/header border-b-border text-xs-plus flex h-10 w-full items-center justify-between border-b font-semibold"
      {...props}
    >
      <div
        ref={setContainer}
        className={cn(
          "mx-2 flex w-full items-center gap-1 py-1.5 group-data-inset/header:mx-8",
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
    <div
      data-slot="content"
      className={cn("h-full overflow-y-auto", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Container, ContainerHeader, ContainerContent };
