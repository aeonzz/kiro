import * as React from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";

import {
  getIssuesPowerSyncCollection,
  powerSyncRowToIssue,
} from "@/lib/collections/issues-powersync";
import { getIssueLabelLinksCollection } from "@/lib/collections/issue-label-links-powersync";
import {
  usePowerSyncTeam,
  usePowerSyncWorkflowStates,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { applyFilters, getDateBuckets } from "@/lib/filter";
import { useHydrated } from "@/hooks/use-hydrated";
import { useIssueDetailsPanelStore } from "@/hooks/use-details-panel-store";
import { useIssueFilters } from "@/hooks/use-issue-filter-store";
import { ContainerContent } from "@/components/container";
import { Error } from "@/components/error";

import { FilterTabs } from "../-components/filter-tabs";
import { IssueList } from "../-components/issue-list";
import { DetailsSidePanel } from "../../-components/details-side-panel";

export const Route = createFileRoute(
  "/_app/$organization/team/$team/_issues/all/"
)({
  head: ({ params }) => ({
    meta: [{ title: `${params.team} · All` }],
  }),
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  const { team, organization } = Route.useParams();
  const isOpen = useIssueDetailsPanelStore((state) => state.isOpen);

  // PowerSync (WASM SQLite) is browser-only, so defer the live-query read until
  // after hydration to keep SSR/first render safe.
  const hydrated = useHydrated();

  return (
    <ContainerContent className="flex flex-1">
      {hydrated ? (
        <PowerSyncIssueList organization={organization} team={team} />
      ) : (
        <IssueList issues={[]} />
      )}
      <TeamDetailsPanel organization={organization} team={team} isOpen={isOpen} />
    </ContainerContent>
  );
}

function TeamDetailsPanel({
  organization,
  team,
  isOpen,
}: {
  organization: string;
  team: string;
  isOpen: boolean;
}) {
  const { team: teamData } = usePowerSyncTeam(organization, team);
  return (
    <DetailsSidePanel title="All issues" team={teamData?.name ?? ""} isOpen={isOpen}>
      <FilterTabs />
    </DetailsSidePanel>
  );
}

const issueFilterFieldMap = {
  status: (issue: { stateId?: string }) => issue.stateId,
  "status-type": (issue: { status: string }) => issue.status,
  priority: (issue: { priority: string }) => issue.priority,
  assignee: (issue: { assigneeId?: string }) => issue.assigneeId,
  creator: (issue: { creatorId?: string }) => issue.creatorId,
  project: (issue: { projectId?: string }) => issue.projectId,
  "created-date": (issue: { createdAt: string }) => getDateBuckets(issue.createdAt),
  "updated-date": (issue: { updatedAt: string }) => getDateBuckets(issue.updatedAt),
  label: (issue: { labelIds: string[] }) => issue.labelIds,
};

function PowerSyncIssueList({
  organization,
  team,
}: {
  organization: string;
  team: string;
}) {
  const teamId = useTeamId(organization, team);
  const workflowStates = usePowerSyncWorkflowStates(teamId);
  const { filters } = useIssueFilters(team);

  const collection = React.useMemo(() => getIssuesPowerSyncCollection(), []);
  const linkCollection = React.useMemo(
    () => getIssueLabelLinksCollection(),
    []
  );

  const { data: rows = [] } = useLiveQuery(
    (q) => q.from({ issue: collection }),
    [collection]
  );
  const { data: links = [] } = useLiveQuery(
    (q) => q.from({ link: linkCollection }),
    [linkCollection]
  );

  const labelsByIssue = React.useMemo(() => {
    const map = new Map<string, string[]>();
    for (const link of links) {
      if (!link.issueId || !link.labelId) continue;
      const list = map.get(link.issueId) ?? [];
      list.push(link.labelId);
      map.set(link.issueId, list);
    }
    return map;
  }, [links]);

  const issues = React.useMemo(
    () =>
      rows
        .filter((row) => row.teamId === teamId)
        .map((row) =>
          powerSyncRowToIssue(
            row,
            workflowStates,
            labelsByIssue.get(row.id as string) ?? []
          )
        ),
    [rows, teamId, workflowStates, labelsByIssue]
  );

  const filteredIssues = React.useMemo(
    () => applyFilters(issues, filters, issueFilterFieldMap),
    [issues, filters]
  );

  return <IssueList issues={filteredIssues} />;
}
