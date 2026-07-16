import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import {
  usePowerSyncTeam,
  usePowerSyncWorkflowStates,
} from "@/lib/collections/team-metadata-powersync";
import { teamQueries } from "@/lib/query-factory";
import { BackButton } from "@/components/back-button";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";

import { WorkflowStatuses } from "./-components/workflow-statuses";

export const Route = createFileRoute(
  "/_app/$organization/settings/teams/$name/statuses/"
)({
  head: ({ params }) => ({
    meta: [{ title: `${params.name} · Issue statuses` }],
  }),
  errorComponent: Error,
  notFoundComponent: () => {
    return <NotFound />;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { name, organization } = Route.useParams();

  const { team: teamData, isLoading } = usePowerSyncTeam(organization, name);

  // Non-blocking: seeds the react-query cache for mutation invalidation.
  const { data } = useQuery(
    teamQueries.detail({ organizationSlug: organization, slug: name })
  );

  // Prefer server payload (has _count on states), fall back to local.
  const localStates = usePowerSyncWorkflowStates(teamData?.id);
  const states = data?.workflowStates ?? (localStates as any);

  if (!isLoading && !teamData) {
    throw notFound();
  }

  return (
    <SettingsContainer key={teamData?.id ?? name}>
      <BackButton
        to="/$organization/settings/teams/$name"
        variant="ghost"
        className="text-muted-foreground w-fit"
        showTooltip={false}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        <span>{teamData?.name ?? ""}</span>
      </BackButton>
      <div className="space-y-1.5">
        <h1 className="text-foreground text-2xl font-medium">Issue statuses</h1>
        <p className="text-muted-foreground text-xs-plus">
          Issue statuses define the workflow that issues go through from start
          to completion.
        </p>
      </div>
      <WorkflowStatuses states={states ?? []} />
    </SettingsContainer>
  );
}
