import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { useLastVisitedStore } from "@/hooks/use-last-visited-store";
import { Container } from "@/components/container";
import { Error } from "@/components/error";

import { Header } from "./-components/header";
import { ListToolbar } from "./-components/list-toolbar";

export const Route = createFileRoute("/_app/$organization/team/$team/_issues")({
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
  const { pathname } = useLocation();
  const setLastIssueTab = useLastVisitedStore((state) => state.setLastIssueTab);

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: team })
  );

  React.useEffect(() => {
    if (
      pathname.endsWith("/all") ||
      pathname.endsWith("/active") ||
      pathname.endsWith("/backlog")
    ) {
      setLastIssueTab(organization, team, pathname);
    }
  }, [pathname, organization, team, setLastIssueTab]);

  if (!data) {
    throw notFound();
  }

  return (
    <Container>
      <Header teamName={data.name} />
      <ListToolbar />
      <Outlet />
    </Container>
  );
}
