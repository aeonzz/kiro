import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { ContainerContent } from "@/components/container";
import { Error } from "@/components/error";

import { DetailsSidePanel } from "../-components/details-side-panel";
import { FilterTabs } from "../-components/filter-tabs";

export const Route = createFileRoute(
  "/_app/$organization/team/$team/_issues/active/"
)({
  loader: async ({ params: { organization, team }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueries.detail({ organizationSlug: organization, slug: team })
    );

    if (!data) {
      throw notFound();
    }

    return {
      title: `${data.name} > Active`,
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
      <div className="flex-1"></div>
      <DetailsSidePanel title="Active issues" team={data.name}>
        <FilterTabs />
      </DetailsSidePanel>
    </ContainerContent>
  );
}
