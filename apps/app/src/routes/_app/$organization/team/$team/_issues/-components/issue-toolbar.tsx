import * as React from "react";

import { cn } from "@/lib/utils";

import { IssueDisplayOptions } from "./issue-display-options";
import { IssueFilterMenu } from "./issue-filter-menu";

export function IssueToolbar({
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
        <IssueFilterMenu />
      </div>
      <div className="flex items-center">
        <IssueDisplayOptions />
      </div>
    </div>
  );
}
