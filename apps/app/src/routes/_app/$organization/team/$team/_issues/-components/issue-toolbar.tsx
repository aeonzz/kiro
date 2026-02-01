import * as React from "react";
import { useParams } from "@tanstack/react-router";

import { issueFilterOptions } from "@/config/team";
import { cn } from "@/lib/utils";
import { useIssueFilters } from "@/hooks/use-issue-filter-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilterChip } from "@/components/filter-chip";

import { IssueDisplayOptions } from "./issue-display-options";
import { IssueFilterMenu } from "./issue-filter-menu";

export function IssueToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const { team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const {
    filters,
    removeFilter,
    toggleFilterValue,
    updateFilterOperator,
    clearFilters,
  } = useIssueFilters(team);

  return (
    <div
      className={cn(
        "no-scrollbar border-border min-h-10 w-full border-b",
        className
      )}
      {...props}
    >
      <div
        ref={setContainer}
        className="mx-6 flex items-start justify-between gap-2 py-2"
      >
        <div className="flex flex-1 flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              filter={filter}
              filterConfig={issueFilterOptions.find(
                (f) => f.id === filter.filterId
              )}
              onRemove={(id) => removeFilter(id)}
              onToggleValue={(id, value) => toggleFilterValue(id, value)}
              onUpdateOperator={(id, operator) =>
                updateFilterOperator(id, operator)
              }
            />
          ))}
          <IssueFilterMenu />
        </div>
        <div className="flex h-full min-w-3xs items-start justify-end gap-2">
          <IssueDisplayOptions tooltipBoundary={container ?? undefined} />
          {filters.length > 1 && (
            <div className="flex w-full items-center justify-end">
              <Button variant="ghost" size="xs">
                Match all filters
              </Button>
            </div>
          )}
          {filters.length > 0 && (
            <React.Fragment>
              <Separator orientation="vertical" className="my-1" />
              <Button
                variant="ghost"
                size="xs"
                onClick={() => clearFilters()}
                tooltip={{
                  content: "Clear all filters",
                  kbd: ["Alt", "⇧", "F"],
                }}
              >
                Clear
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
