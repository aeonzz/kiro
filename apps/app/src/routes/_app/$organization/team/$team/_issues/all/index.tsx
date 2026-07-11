import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { issueQueries, teamQueries } from "@/lib/query-factory";
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
  const { data: issues } = useSuspenseQuery(
    issueQueries.lists({ organizationSlug: organization, teamSlug: team })
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
