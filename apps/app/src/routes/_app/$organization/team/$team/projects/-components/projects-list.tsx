import React from "react";
import type { StrictOmit } from "@/types";

import { cn } from "@/lib/utils";

interface ProjectsListProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {}

export function ProjectsList({ className, ...props }: ProjectsListProps) {
  return (
    <div {...props} className={cn("relative h-full min-w-0 flex-1", className)}>
      
    </div>
  );
}
