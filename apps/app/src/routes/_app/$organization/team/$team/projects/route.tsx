import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { usePowerSyncTeam } from "@/lib/collections/team-metadata-powersync";
import { Container } from "@/components/container";
import { Error } from "@/components/error";

import { Header } from "./-components/header";
import { ProjectToolbar } from "./-components/project-toolbar";

export const Route = createFileRoute("/_app/$organization/team/$team/projects")(
  {
    errorComponent: Error,
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { team, organization } = Route.useParams();

  // Team is resolved locally from PowerSync (no network) so this works offline.
  const { team: teamData, isLoading } = usePowerSyncTeam(organization, team);

  // Only 404 once the local tables have hydrated — otherwise a real team would
  // flash not-found while the collection is still loading.
  if (!isLoading && !teamData) {
    throw notFound();
  }

  return (
    <Container>
      <Header teamName={teamData?.name ?? ""} />
      <ProjectToolbar />
      <Outlet />
    </Container>
  );
}
