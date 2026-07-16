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
import { useHydrated } from "@/hooks/use-hydrated";
import { useIssueDetailsPanelStore } from "@/hooks/use-details-panel-store";
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

function PowerSyncIssueList({
  organization,
  team,
}: {
  organization: string;
  team: string;
}) {
  const teamId = useTeamId(organization, team);
  const workflowStates = usePowerSyncWorkflowStates(teamId);

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

  return <IssueList issues={issues} />;
}
