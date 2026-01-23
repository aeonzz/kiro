import * as React from "react";
import { Cancel01Icon, CommandIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ListBox } from "@/components/ui/list-box";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ActionBar,
  ActionBarClose,
  ActionBarContent,
  ActionBarSeparator,
} from "@/components/action-bar";

import { IssueCard } from "./issue-card";

interface IssueListProps extends React.ComponentProps<typeof ScrollArea> {}

const MOCK_ITEMS = [
  { id: "ADF-13", label: "Dashboard" },
  { id: "ADF-14", label: "Settings" },
  { id: "ADF-15", label: "Profile" },
  { id: "ADF-16", label: "Messages" },
  { id: "ADF-17", label: "Logout" },
];

export function IssueList({ className, ...props }: IssueListProps) {
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
    <ScrollArea
      ref={setContainer}
      className={cn(
        "h-full min-h-0 flex-1 **:data-[slot=scroll-area-viewport]:focus-visible:ring-0 **:data-[slot=scroll-area-viewport]:focus-visible:outline-0",
        className
      )}
    >
      <div className={cn("h-full", className)} {...props}>
        <ListBox items={MOCK_ITEMS}>
          {MOCK_ITEMS.map((item, index) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <IssueCard
                key={item.id}
                index={index}
                isSelected={isSelected}
                toggleId={toggleId}
                item={item}
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
    </ScrollArea>
  );
}
