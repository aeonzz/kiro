import * as React from "react";
import {
  createFileRoute,
  notFound,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

import { teamIssueTabs } from "@/config/team";
import { usePowerSyncTeam } from "@/lib/collections/team-metadata-powersync";
import { isNavLinkActive } from "@/lib/utils";
import { useLastVisitedStore } from "@/hooks/use-last-visited-store";
import { Container } from "@/components/container";
import { Error } from "@/components/error";

import { Header } from "./-components/header";
import { IssueToolbar } from "./-components/issue-toolbar";

export const Route = createFileRoute("/_app/$organization/team/$team/_issues")({
  head: ({ params }) => ({
    meta: [{ title: params.team }],
  }),
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  const { team, organization } = Route.useParams();
  const { pathname } = useLocation();
  const setLastIssueTab = useLastVisitedStore((state) => state.setLastIssueTab);

  // Team is resolved locally from PowerSync (no network) so this works offline.
  const { team: teamData, isLoading } = usePowerSyncTeam(organization, team);

  React.useEffect(() => {
    const isIssueTab = teamIssueTabs.some((tab) =>
      isNavLinkActive(pathname, tab.url, organization, team)
    );

    if (isIssueTab) {
      setLastIssueTab(organization, team, pathname);
    }
  }, [pathname, organization, team, setLastIssueTab]);

  // Only 404 once the local tables have hydrated — otherwise a real team would
  // flash not-found while the collection is still loading.
  if (!isLoading && !teamData) {
    throw notFound();
  }

  return (
    <Container>
      <Header teamName={teamData?.name ?? ""} />
      <IssueToolbar />
      <Outlet />
    </Container>
  );
}
