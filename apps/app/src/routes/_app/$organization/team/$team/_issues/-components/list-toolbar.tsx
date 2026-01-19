import * as React from "react";

import { cn } from "@/lib/utils";

import { ListDisplayOptions } from "./list-display-options";
import { ListFilterMenu } from "./list-filter-menu";

export function ListToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "no-scrollbar border-border flex h-10 w-full items-center justify-between border-b px-8",
        className
      )}
      {...props}
    >
      <div className="flex-1">
        <ListFilterMenu />
      </div>
      <div className="flex items-center">
        <ListDisplayOptions />
      </div>
    </div>
  );
}
