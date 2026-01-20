import * as React from "react";

import { filterOptions } from "@/config/inbox";
import { cn } from "@/lib/utils";
import { useInboxFilters } from "@/hooks/use-inbox-filter-store";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";
import { useOrganization } from "@/components/organization-context";

import { InboxFilterMenu } from "./inbox-filter-menu";

export function InboxFilterList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { activeOrganization } = useOrganization();
  const { filters, removeFilter, toggleFilterValue, updateFilterOperator } =
    useInboxFilters(activeOrganization?.id);

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
          <FilterChip
            key={filter.id}
            filter={filter}
            filterConfig={filterOptions.find((f) => f.id === filter.filterId)}
            onRemove={(id) => removeFilter(id)}
            onToggleValue={(id, value) => toggleFilterValue(id, value)}
            onUpdateOperator={(id, operator) =>
              updateFilterOperator(id, operator)
            }
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
