import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { Container } from "@/components/container";
import { Error } from "@/components/error";

import { Header } from "./-components/header";

export const Route = createFileRoute("/_app/$organization/team/$team/projects")(
  {
    loader: async ({ params: { organization, team }, context }) => {
      const data = await context.queryClient.ensureQueryData(
        teamQueries.detail({ organizationSlug: organization, slug: team })
      );

      if (!data) {
        throw notFound();
      }
    },
    errorComponent: Error,
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { team, organization } = Route.useParams();

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: team })
  );

  if (!data) {
    throw notFound();
  }

  return (
    <Container>
      <Header teamName={data.name} />
      <Outlet />
    </Container>
  );
}
