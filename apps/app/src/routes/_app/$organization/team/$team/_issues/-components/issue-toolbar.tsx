import * as React from "react";
import { PanelRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import { issueFilterOptions } from "@/config/team";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import { useIssueDetailsPanelStore } from "@/hooks/use-details-panel-store";
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
import { IssueTabs } from "./issue-tabs";

export function IssueToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const { team, organization } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const tabKey = useIssueTabKey(team);
  const { isOpen, toggle } = useIssueDetailsPanelStore();
  const { filters, clearFilters } = useIssueFilters(tabKey);
  // Clear still empties the panel's scope when it is on screen, but it is never
  // shown *because* of it — the panel undoes its own selections by toggling the
  // chosen option off again.
  const { clearFilters: clearPanelFilters } = useIssuePanelFilters(tabKey);
  const hydrated = useHydrated();

  // Chips are the only thing that opens the filter row, and the only thing that
  // surfaces Clear. Panel filters draw no chips, so they do neither.
  const hasChips = filters.length > 0;

  const clearButton = (
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
  );

  return (
    <div className={cn("no-scrollbar w-full", className)} {...props}>
      <div className="w-full">
        <div
          ref={setContainer}
          className="mx-2 flex min-h-10 items-center justify-between gap-2 py-2"
        >
          <IssueTabs
            organization={organization}
            teamSlug={team}
            tooltipBoundary={container ?? undefined}
          />
          <div className="flex items-center gap-2">
            {/*
              With nothing filtered there is no second row, so the way to add a
              filter has to live up here. Once a filter exists it moves down
              beside the chips it produces.
            */}
            {!hasChips &&
              (hydrated ? (
                <IssueToolbarFilters organization={organization} team={team} />
              ) : (
                <IssueFilterMenu />
              ))}
            <IssueDisplayOptions tooltipBoundary={container ?? undefined} />
            <Button
              size="icon-xs"
              variant="outline"
              activable
              aria-expanded={isOpen}
              onClick={toggle}
              tooltip={{
                content: isOpen ? "Close details" : "Open details",
                kbd: ["Ctrl", "I"],
                tooltipProps: {
                  side: "bottom",
                  collisionBoundary: container ?? undefined,
                },
              }}
            >
              <HugeiconsIcon icon={PanelRightIcon} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>

      {hasChips && (
        <div className="w-full">
          <div className="mx-2 flex min-h-10 items-start justify-between gap-2 py-2">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {hydrated ? (
                <IssueToolbarFilters organization={organization} team={team} />
              ) : (
                <IssueFilterMenu />
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {filters.length > 1 && (
                <Button variant="ghost" size="xs">
                  Match all filters
                </Button>
              )}
              <Separator orientation="vertical" className="my-1" />
              {clearButton}
            </div>
          </div>
        </div>
      )}
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
