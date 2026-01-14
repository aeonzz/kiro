import * as React from "react";

import { cn } from "@/lib/utils";
import { useInboxFilters } from "@/hooks/use-inbox-filter-store";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/components/organization-context";

import { InboxFilterChip } from "./inbox-filter-chip";
import { InboxFilterMenu } from "./inbox-filter-menu";

export function InboxFilterList({
  containerRef,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  containerRef: HTMLDivElement | null;
}) {
  const { activeOrganization } = useOrganization();
  const { filters } = useInboxFilters(activeOrganization?.id);

  if (filters.length === 0) return null;

  return (
    <div
      className={cn(
        "border-border no-scrollbar flex min-w-sm flex-wrap items-center gap-2 overflow-x-auto border-b px-4 py-2",
        className
      )}
      {...props}
    >
      {filters.map((filter) => (
        <InboxFilterChip
          key={filter.id}
          filter={filter}
          containerRef={containerRef}
          orgId={activeOrganization?.id}
        />
      ))}
      <InboxFilterMenu containerRef={containerRef} />
      {filters.length > 1 && (
        <div className="flex w-full items-center justify-end">
          <Button variant="ghost" size="sm">
            Match all filters
          </Button>
        </div>
      )}
    </div>
  );
}
