import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
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

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: team })
  );

  if (!data) {
    throw notFound();
  }

  return (
    <ContainerContent className="flex flex-1">
      <ProjectsList />
      <DetailsSidePanel title="Projects" team={data.name} isOpen={isOpen}>
        {/* <FilterTabs /> */}
      </DetailsSidePanel>
    </ContainerContent>
  );
}
