import * as React from "react";
import { useLiveQuery } from "@tanstack/react-db";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import type { Issue } from "@/types/issue";
import { getIssueLabelLinksCollection } from "@/lib/collections/issue-label-links";
import { getIssuesCollection } from "@/lib/collections/issues";
import { teamQueries } from "@/lib/query-factory";
import { useIssueDetailsPanelStore } from "@/hooks/use-details-panel-store";
import { useTeamWorkflowStates } from "@/hooks/use-team-workflow-states";
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
  const queryClient = useQueryClient();
  const isOpen = useIssueDetailsPanelStore((state) => state.isOpen);

  const issuesCollection = getIssuesCollection({
    queryClient,
    organizationSlug: organization,
    teamSlug: team,
  });

  const labelLinksCollection = getIssueLabelLinksCollection({
    queryClient,
    organizationSlug: organization,
    teamSlug: team,
  });
  const workflowStates = useTeamWorkflowStates(team);

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: team })
  );

  // Electric syncs raw table rows; rebuild the denormalized issue the UI wants
  // by joining issue rows with their label links and the team's workflow states.
  const { data: issueRows = [] } = useLiveQuery(
    (query) =>
      query.from({ issue: issuesCollection }).select(({ issue }) => issue),
    [issuesCollection]
  );
  
  const { data: labelLinks = [] } = useLiveQuery(
    (query) =>
      query.from({ link: labelLinksCollection }).select(({ link }) => link),
    [labelLinksCollection]
  );

  const issues = React.useMemo<Issue[]>(() => {
    const stateById = new Map(workflowStates.map((state) => [state.id, state]));
    const labelIdsByIssue = new Map<string, string[]>();

    for (const link of labelLinks) {
      const existing = labelIdsByIssue.get(link.issueId);
      if (existing) {
        existing.push(link.labelId);
      } else {
        labelIdsByIssue.set(link.issueId, [link.labelId]);
      }
    }

    return issueRows.map((row) => {
      const state = stateById.get(row.stateId);

      return {
        id: row.id,
        number: row.number,
        title: row.title,
        teamId: row.teamId,
        stateId: row.stateId,
        stateName: state?.name,
        stateColor: state?.color,
        stateType: (state?.type ?? "BACKLOG") as Issue["stateType"],
        priority: row.priority,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        assigneeId: row.assigneeId ?? undefined,
        labelIds: labelIdsByIssue.get(row.id) ?? [],
      } satisfies Issue;
    });
  }, [issueRows, labelLinks, workflowStates]);

  if (!data) {
    throw notFound();
  }

  return (
    <ContainerContent className="flex flex-1">
      <IssueList key={`${organization}:${team}`} issues={issues} />
      <DetailsSidePanel title="All issues" team={data.name} isOpen={isOpen}>
        <FilterTabs />
      </DetailsSidePanel>
    </ContainerContent>
  );
}
