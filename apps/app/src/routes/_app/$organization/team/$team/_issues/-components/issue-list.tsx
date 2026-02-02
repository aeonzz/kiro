import * as React from "react";
import type { StrictOmit } from "@/types";
import { CommandIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { useIssueStore } from "@/hooks/use-issue-store";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ListBox } from "@/components/ui/list-box";
import {
  ActionBar,
  ActionBarClose,
  ActionBarContent,
  ActionBarSeparator,
} from "@/components/action-bar";

import { IssueListItem } from "./issue-list-item";

interface IssueListProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {}

export function IssueList({ className, ...props }: IssueListProps) {
  const { issues } = useIssueStore();
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div ref={setContainer} className="relative h-full min-w-0 flex-1">
      <div className={cn("h-full min-h-0 overflow-y-auto", className)}>
        <div className={cn("h-full", className)} {...props}>
          <ListBox items={issues}>
            {issues.map((issue, index) => {
              const isSelected = selectedIds.has(issue.id);
              return (
                <IssueListItem
                  key={issue.id}
                  index={index}
                  isSelected={isSelected}
                  toggleId={toggleId}
                  issue={issue}
                />
              );
            })}
          </ListBox>
        </div>
        <ActionBar
          open={selectedIds.size > 0}
          onOpenChange={(open) => !open && setSelectedIds(new Set())}
        >
          <ActionBarContent container={container}>
            <ButtonGroup className="*:data-[slot=button]:border-foreground/15 shadow-sm *:data-[slot=button]:border *:data-[slot=button]:border-dashed *:data-[slot=button]:shadow-none">
              <Button variant="ghost" size="sm" className="tabular-nums">
                {selectedIds.size} selected
              </Button>
              <ActionBarClose />
            </ButtonGroup>
            <ActionBarSeparator />
            <Button variant="secondary" size="sm">
              <HugeiconsIcon icon={CommandIcon} strokeWidth={2} />
              Actions
            </Button>
          </ActionBarContent>
        </ActionBar>
      </div>
    </div>
  );
}
