import * as React from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

function IssueStatusGroup({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="issue-status-group"
      className={cn("overflow-hidden", className)}
      {...props}
    />
  );
}

function IssueStatusGroupHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="issue-status-group-header"
      className={cn(
        "bg-muted flex h-9 items-center justify-between rounded-md pr-2 pl-3",
        className
      )}
      {...props}
    />
  );
}

function IssueStatusGroupTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="issue-status-group-title"
      className={cn("text-muted-foreground text-sm font-medium", className)}
      {...props}
    />
  );
}

function IssueStatusGroupAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="issue-status-group-action"
      type="button"
      variant="ghost"
      size="icon-xs"
      className={cn(
        "text-muted-foreground aria-expanded:bg-none! aria-expanded:shadow-none! dark:aria-expanded:bg-none! dark:aria-expanded:shadow-none!",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2} />
    </Button>
  );
}

function IssueStatusList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="issue-status-list" className={cn(className)} {...props} />
  );
}

function IssueStatusItem({
  className,
  ...props
}: React.ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="issue-status-item"
      variant="outline"
      className={cn(
        "border-border min-h-14 items-center gap-3 rounded-none border-0 border-b px-1 py-3 last:border-0 hover:bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function IssueStatusItemAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="issue-status-item-action"
      className={cn(
        "ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-focus-within/item:opacity-100 group-hover/item:opacity-100 has-aria-expanded:opacity-100",
        className
      )}
      {...props}
    />
  );
}

function IssueStatusItemMedia({
  className,
  ...props
}: React.ComponentProps<typeof ItemMedia>) {
  return (
    <ItemMedia
      data-slot="issue-status-item-media"
      className={cn(
        "bg-muted/60 grid size-8 shrink-0 place-items-center self-center rounded-md p-0 leading-none [&_svg]:block [&_svg]:size-[18px]",
        className
      )}
      {...props}
    />
  );
}

function IssueStatusItemContent({
  className,
  ...props
}: React.ComponentProps<typeof ItemContent>) {
  return (
    <ItemContent
      data-slot="issue-status-item-content"
      className={cn("min-w-0 gap-1", className)}
      {...props}
    />
  );
}

function IssueStatusItemTitle({
  className,
  ...props
}: React.ComponentProps<typeof ItemTitle>) {
  return (
    <ItemTitle
      data-slot="issue-status-item-title"
      className={cn("text-foreground truncate text-sm", className)}
      {...props}
    />
  );
}

function IssueStatusItemDescription({
  className,
  ...props
}: React.ComponentProps<typeof ItemDescription>) {
  return (
    <ItemDescription
      data-slot="issue-status-item-description"
      className={cn("truncate text-xs", className)}
      {...props}
    />
  );
}

function IssueStatusItemMeta({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="issue-status-item-meta"
      className={cn("text-muted-foreground shrink-0 text-xs", className)}
      {...props}
    />
  );
}

export {
  IssueStatusGroup,
  IssueStatusGroupHeader,
  IssueStatusGroupTitle,
  IssueStatusGroupAction,
  IssueStatusList,
  IssueStatusItem,
  IssueStatusItemAction,
  IssueStatusItemMedia,
  IssueStatusItemContent,
  IssueStatusItemTitle,
  IssueStatusItemDescription,
  IssueStatusItemMeta,
};
