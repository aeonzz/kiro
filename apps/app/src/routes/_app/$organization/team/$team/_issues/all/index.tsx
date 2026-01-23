import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { ContainerContent } from "@/components/container";
import { Error } from "@/components/error";

import { DetailsSidePanel } from "../-components/details-side-panel";
import { FilterTabs } from "../-components/filter-tabs";
import { IssueList } from "../-components/issue-list";

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

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: team })
  );

  if (!data) {
    throw notFound();
  }

  return (
    <ContainerContent className="flex">
      <IssueList />
      <DetailsSidePanel title="All issues" team={data.name}>
        <FilterTabs />
      </DetailsSidePanel>
    </ContainerContent>
  );
}
