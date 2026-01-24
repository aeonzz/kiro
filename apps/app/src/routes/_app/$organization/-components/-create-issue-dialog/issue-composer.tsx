import * as React from "react";
import type { StrictOmit } from "@/types";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface IssueComposerProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {}

export function IssueComposer({ className, ...props }: IssueComposerProps) {
  return (
    <div className={cn("flex flex-col px-3", className)} {...props}>
      <Textarea
        className="placeholder:text-muted-foreground/60 px-1 text-lg! font-semibold shadow-none focus-visible:ring-0"
        autoComplete="off"
        autoCorrect="off"
        placeholder="Issue title"
        maxLength={512}
        autoFocus
      />
    </div>
  );
}
