import * as React from "react";
import { useParams } from "@tanstack/react-router";

import { issueFilterOptions } from "@/config/team";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  useIssueFilters,
  useIssuePanelFilters,
} from "@/hooks/use-issue-filter-store";
import { useIssueOptionCounts } from "@/hooks/use-issue-option-counts";
import { useIssueStatusOptions } from "@/hooks/use-issue-status";
import { useIssueTabKey } from "@/hooks/use-issue-tab-key";
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
  const { team, organization } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const tabKey = useIssueTabKey(team);
  const { filters, clearFilters } = useIssueFilters(tabKey);
  // The panel's filters draw no chips, so Clear is the only way back out of
  // them — it has to see and empty that scope too.
  const { filters: panelFilters, clearFilters: clearPanelFilters } =
    useIssuePanelFilters(tabKey);
  const hydrated = useHydrated();

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
          {hydrated ? (
            <IssueToolbarFilters organization={organization} team={team} />
          ) : (
            <IssueFilterMenu />
          )}
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
          {filters.length + panelFilters.length > 0 && (
            <React.Fragment>
              <Separator orientation="vertical" className="my-1" />
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  clearFilters();
                  clearPanelFilters();
                }}
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

function IssueToolbarFilters({
  organization,
  team,
}: {
  organization: string;
  team: string;
}) {
  const { filters, removeFilter, toggleFilterValue, updateFilterOperator } =
    useIssueFilters(useIssueTabKey(team));
  const teamId = useTeamId(organization, team);
  const statusOptions = useIssueStatusOptions(team);
  const teamLabels = usePowerSyncTeamLabels(teamId);
  const teamProjects = usePowerSyncTeamProjects(teamId);
  const orgMembers = usePowerSyncOrgMembers(organization);

  const filterOptions = React.useMemo(
    () =>
      issueFilterOptions.map((f) => {
        if (f.id === "status") return { ...f, options: statusOptions };
        if (f.id === "label") return { ...f, options: teamLabels };
        if (f.id === "assignee") return { ...f, options: orgMembers };
        if (f.id === "creator") return { ...f, options: orgMembers };
        if (f.id === "project") return { ...f, options: teamProjects };
        return f;
      }),
    [statusOptions, teamLabels, orgMembers, teamProjects]
  );

  const optionCountsByFilterId = useIssueOptionCounts(teamId);

  return (
    <>
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          filter={filter}
          filterConfig={filterOptions.find((f) => f.id === filter.filterId)}
          optionCounts={optionCountsByFilterId[filter.filterId]}
          onRemove={(id) => removeFilter(id)}
          onToggleValue={(id, value) => toggleFilterValue(id, value)}
          onUpdateOperator={(id, operator) =>
            updateFilterOperator(id, operator)
          }
        />
      ))}
      <IssueFilterMenu
        filterOptions={filterOptions}
        optionCountsByFilterId={optionCountsByFilterId}
      />
    </>
  );
}
