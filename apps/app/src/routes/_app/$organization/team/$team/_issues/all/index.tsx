import * as React from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";

import { getIssueLabelLinksCollection } from "@/lib/collections/issue-label-links-powersync";
import {
  getIssuesPowerSyncCollection,
  powerSyncRowToIssue,
} from "@/lib/collections/issues-powersync";
import {
  usePowerSyncTeam,
  usePowerSyncWorkflowStates,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { applyFilters, getDateBuckets } from "@/lib/filter";
import { useIssueDetailsPanelStore } from "@/hooks/use-details-panel-store";
import {
  GROUP_ID_NO_PROJECT,
  GROUP_ID_UNASSIGNED,
} from "@/hooks/use-grouped-issues";
import { useHydrated } from "@/hooks/use-hydrated";
import { useActiveIssueDisplayOptions } from "@/hooks/use-issue-display-store";
import {
  useIssueFilters,
  useIssuePanelFilters,
} from "@/hooks/use-issue-filter-store";
import { IssueTabProvider, useIssueTabKey } from "@/hooks/use-issue-tab-key";
import { ContainerContent } from "@/components/container";
import { Error } from "@/components/error";

import { FilterTabs } from "../-components/filter-tabs";
import { IssueBoard } from "../-components/issue-board";
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
  const hydrated = useHydrated();

  return (
    <IssueTabProvider tab="all">
      <ContainerContent className="flex flex-1">
        {hydrated ? (
          <PowerSyncIssueList organization={organization} team={team} />
        ) : (
          <IssueList issues={[]} />
        )}
        <TeamDetailsPanel
          organization={organization}
          team={team}
          isOpen={isOpen}
        />
      </ContainerContent>
    </IssueTabProvider>
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
    <DetailsSidePanel
      title="All issues"
      team={teamData?.name ?? ""}
      isOpen={isOpen}
    >
      <FilterTabs />
    </DetailsSidePanel>
  );
}

const issueFilterFieldMap = {
  status: (issue: { stateId?: string }) => issue.stateId,
  "status-type": (issue: { status: string }) => issue.status,
  priority: (issue: { priority: string }) => issue.priority,
  // Fall back to the sentinel rather than null: applyFilters turns a nullish
  // accessor result into no values at all, which can never match the
  // "No assignee"/"No project" options the filter surfaces offer.
  assignee: (issue: { assigneeId?: string }) =>
    issue.assigneeId ?? GROUP_ID_UNASSIGNED,
  creator: (issue: { creatorId?: string }) => issue.creatorId,
  project: (issue: { projectId?: string }) =>
    issue.projectId ?? GROUP_ID_NO_PROJECT,
  "created-date": (issue: { createdAt: string }) =>
    getDateBuckets(issue.createdAt),
  "updated-date": (issue: { updatedAt: string }) =>
    getDateBuckets(issue.updatedAt),
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
  const tabKey = useIssueTabKey(team);
  const { filters } = useIssueFilters(tabKey);
  const { filters: panelFilters } = useIssuePanelFilters(tabKey);
  const { layout } = useActiveIssueDisplayOptions(tabKey);

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
    () =>
      applyFilters(issues, [...filters, ...panelFilters], issueFilterFieldMap),
    [issues, filters, panelFilters]
  );

  // Measured before grouping so it counts what the filters removed, not what
  // the display options fold away.
  const hiddenCount = issues.length - filteredIssues.length;

  if (layout === "board")
    return <IssueBoard issues={filteredIssues} hiddenCount={hiddenCount} />;
  return <IssueList issues={filteredIssues} hiddenCount={hiddenCount} />;
}
