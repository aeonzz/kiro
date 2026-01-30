import * as React from "react";
import type { StrictOmit } from "@/types";
import { NoteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import type { IssueDraft } from "@/hooks/use-issue-draft-store";
import { ContainerContent } from "@/components/container";

import { IssueDraftCard } from "./issue-draft-card";

interface IssueDraftListProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {
  drafts: Array<IssueDraft>;
}

export function IssueDraftList({
  drafts,
  className,
  ...props
}: IssueDraftListProps) {
  return (
    <ContainerContent className={cn("p-8", className)} {...props}>
      {drafts.length > 0 ? (
        <React.Fragment>
          <span className="text-muted-foreground text-xs-plus">Issues</span>
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {drafts.map((draft) => (
              <IssueDraftCard key={draft.id} draft={draft} />
            ))}
          </div>
        </React.Fragment>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="space-y-2 text-center">
            <HugeiconsIcon
              icon={NoteIcon}
              strokeWidth={0.5}
              className="size-24"
            />
            <span className="text-xs-plus text-muted-foreground font-normal">
              No Active drafts
            </span>
          </div>
        </div>
      )}
    </ContainerContent>
  );
}
