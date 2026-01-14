import * as React from "react";

import { cn } from "@/lib/utils";
import { useInboxFilters } from "@/hooks/use-inbox-filter-store";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/components/organization-context";

import { InboxFilterChip } from "./inbox-filter-chip";
import { InboxFilterMenu } from "./inbox-filter-menu";

export function InboxFilterList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { activeOrganization } = useOrganization();
  const { filters } = useInboxFilters(activeOrganization?.id);

  if (filters.length === 0) return null;

  return (
    <div
      className={cn(
        "no-scrollbar border-border flex flex-col overflow-x-auto border-b",
        className
      )}
      {...props}
    >
      <div className="flex w-fit min-w-full flex-wrap items-center gap-2 px-4 py-2">
        {filters.map((filter) => (
          <InboxFilterChip
            key={filter.id}
            filter={filter}
            orgId={activeOrganization?.id}
          />
        ))}
        <InboxFilterMenu align="start" />
        {filters.length > 1 && (
          <div className="flex w-full items-center justify-end">
            <Button variant="ghost" size="sm">
              Match all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
