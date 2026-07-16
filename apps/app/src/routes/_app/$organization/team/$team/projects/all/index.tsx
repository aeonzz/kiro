import { createFileRoute } from "@tanstack/react-router";

import { usePowerSyncTeam } from "@/lib/collections/team-metadata-powersync";
import { useProjectsPanelStore } from "@/hooks/use-details-panel-store";
import { ContainerContent } from "@/components/container";

import { ProjectsList } from "../-components/projects-list";
import { DetailsSidePanel } from "../../-components/details-side-panel";

export const Route = createFileRoute(
  "/_app/$organization/team/$team/projects/all/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { team, organization } = Route.useParams();

  const isOpen = useProjectsPanelStore((state) => state.isOpen);

  // Team name is read locally from PowerSync (parent `projects` route validates
  // the team); works offline with no server query.
  const { team: teamData } = usePowerSyncTeam(organization, team);

  return (
    <ContainerContent className="flex flex-1">
      <ProjectsList />
      <DetailsSidePanel title="Projects" team={teamData?.name ?? ""} isOpen={isOpen}>
        {/* <FilterTabs /> */}
      </DetailsSidePanel>
    </ContainerContent>
  );
}
