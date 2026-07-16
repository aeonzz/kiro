import * as React from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";

import { issueFilterOptions } from "@/config/team";
import { cn } from "@/lib/utils";
import { getDateBuckets } from "@/lib/filter";
import { getIssuesPowerSyncCollection } from "@/lib/collections/issues-powersync";
import { getIssueLabelLinksCollection } from "@/lib/collections/issue-label-links-powersync";
import {
  useTeamId,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  usePowerSyncOrgMembers,
} from "@/lib/collections/team-metadata-powersync";
import { useHydrated } from "@/hooks/use-hydrated";
import { useIssueFilters } from "@/hooks/use-issue-filter-store";
import { useIssueStatusOptions } from "@/hooks/use-issue-status";
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
  const { filters, clearFilters } = useIssueFilters(team);
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

function IssueToolbarFilters({
  organization,
  team,
}: {
  organization: string;
  team: string;
}) {
  const { filters, removeFilter, toggleFilterValue, updateFilterOperator } =
    useIssueFilters(team);
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

  const issueCollection = React.useMemo(() => getIssuesPowerSyncCollection(), []);
  const linkCollection = React.useMemo(() => getIssueLabelLinksCollection(), []);
  const { data: rows = [] } = useLiveQuery(
    (q) => q.from({ issue: issueCollection }),
    [issueCollection]
  );
  const { data: links = [] } = useLiveQuery(
    (q) => q.from({ link: linkCollection }),
    [linkCollection]
  );

  const teamIssueIds = React.useMemo(() => {
    const ids = new Set<string>();
    for (const row of rows) {
      if (row.teamId === teamId && row.id) ids.add(row.id as string);
    }
    return ids;
  }, [rows, teamId]);

  const optionCountsByFilterId = React.useMemo(() => {
    const byState: Record<string, number> = {};
    const byLabel: Record<string, number> = {};
    const byAssignee: Record<string, number> = {};
    const byCreator: Record<string, number> = {};
    const byProject: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byCreatedDate: Record<string, number> = {};
    const byUpdatedDate: Record<string, number> = {};
    for (const row of rows) {
      if (row.teamId !== teamId) continue;
      const stateId = row.stateId as string;
      if (stateId) byState[stateId] = (byState[stateId] ?? 0) + 1;
      const assigneeId = row.assigneeId as string | undefined;
      byAssignee[assigneeId ?? "unassigned"] = (byAssignee[assigneeId ?? "unassigned"] ?? 0) + 1;
      const creatorId = row.creatorId as string | undefined;
      if (creatorId) byCreator[creatorId] = (byCreator[creatorId] ?? 0) + 1;
      const projectId = row.projectId as string | undefined;
      if (projectId) byProject[projectId] = (byProject[projectId] ?? 0) + 1;
      const priority = row.priority as string;
      if (priority) byPriority[priority] = (byPriority[priority] ?? 0) + 1;
      for (const bucket of getDateBuckets(row.createdAt as string)) {
        byCreatedDate[bucket] = (byCreatedDate[bucket] ?? 0) + 1;
      }
      for (const bucket of getDateBuckets(row.updatedAt as string)) {
        byUpdatedDate[bucket] = (byUpdatedDate[bucket] ?? 0) + 1;
      }
    }
    for (const link of links) {
      const issueId = link.issueId as string;
      const labelId = link.labelId as string;
      if (!issueId || !labelId || !teamIssueIds.has(issueId)) continue;
      byLabel[labelId] = (byLabel[labelId] ?? 0) + 1;
    }
    return { status: byState, label: byLabel, assignee: byAssignee, creator: byCreator, project: byProject, priority: byPriority, "created-date": byCreatedDate, "updated-date": byUpdatedDate };
  }, [rows, links, teamId, teamIssueIds]);

  return (
    <>
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          filter={filter}
          filterConfig={filterOptions.find((f) => f.id === filter.filterId)}
          optionCounts={optionCountsByFilterId[filter.filterId as keyof typeof optionCountsByFilterId]}
          onRemove={(id) => removeFilter(id)}
          onToggleValue={(id, value) => toggleFilterValue(id, value)}
          onUpdateOperator={(id, operator) => updateFilterOperator(id, operator)}
        />
      ))}
      <IssueFilterMenu
        filterOptions={filterOptions}
        optionCountsByFilterId={optionCountsByFilterId}
      />
    </>
  );
}
