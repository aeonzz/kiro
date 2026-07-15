import * as React from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import {
  getIssuesPowerSyncCollection,
  powerSyncRowToIssue,
} from "@/lib/collections/issues-powersync";
import { getIssueLabelLinksCollection } from "@/lib/collections/issue-label-links-powersync";
import {
  usePowerSyncWorkflowStates,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { useIssueDetailsPanelStore } from "@/hooks/use-details-panel-store";
import { ContainerContent } from "@/components/container";
import { Error } from "@/components/error";

import { FilterTabs } from "../-components/filter-tabs";
import { IssueList } from "../-components/issue-list";
import { DetailsSidePanel } from "../../-components/details-side-panel";

export const Route = createFileRoute(
  "/_app/$organization/team/$team/_issues/all/"
)({
  loader: async ({ params: { organization, team }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueries.detail({ organizationSlug: organization, slug: team })
    );

    if (!data) {
      throw notFound();
    }

    return {
      title: `${data.name} > All`,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : undefined,
  }),
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  const { team, organization } = Route.useParams();
  const isOpen = useIssueDetailsPanelStore((state) => state.isOpen);

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: team })
  );

  // PowerSync (WASM SQLite) is browser-only, so defer the live-query read until
  // after mount to keep SSR/first render safe.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!data) {
    throw notFound();
  }

  return (
    <ContainerContent className="flex flex-1">
      {mounted ? (
        <PowerSyncIssueList organization={organization} team={team} />
      ) : (
        <IssueList issues={[]} />
      )}
      <DetailsSidePanel title="All issues" team={data.name} isOpen={isOpen}>
        <FilterTabs />
      </DetailsSidePanel>
    </ContainerContent>
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
