import { useLiveQuery } from "@tanstack/react-db";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { issueQueries, teamQueries } from "@/lib/query-factory";
import { getIssuesCollection } from "@/lib/collections/issues";
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

    // Warm the same query key the issues collection reads from so the list
    // isn't empty on first paint (useLiveQuery is not suspense-backed).
    void context.queryClient.ensureQueryData(
      issueQueries.lists({ organizationSlug: organization, teamSlug: team })
    );

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

  const qc = useQueryClient();
  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: team })
  );

  const issuesCollection = getIssuesCollection({
    queryClient: qc,
    organizationSlug: organization,
    teamSlug: team,
  });
  const { data: issues = [] } = useLiveQuery(
    (q) => q.from({ issue: issuesCollection }),
    [issuesCollection]
  );

  if (!data) {
    throw notFound();
  }

  return (
    <ContainerContent className="flex flex-1">
      <IssueList issues={issues} />
      <DetailsSidePanel title="All issues" team={data.name} isOpen={isOpen}>
        <FilterTabs />
      </DetailsSidePanel>
    </ContainerContent>
  );
}
