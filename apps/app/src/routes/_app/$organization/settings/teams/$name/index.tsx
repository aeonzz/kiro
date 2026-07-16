import { ArrowLeft01Icon, Work } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutationState, useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { usePowerSyncTeam } from "@/lib/collections/team-metadata-powersync";
import { teamQueries } from "@/lib/query-factory";
import { BackButton } from "@/components/back-button";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";

import { DangerZone } from "./-components/danger-zone";
import { General } from "./-components/general";
import { Workflow } from "./-components/workflow";

export const Route = createFileRoute(
  "/_app/$organization/settings/teams/$name/"
)({
  head: ({ params }) => ({
    meta: [{ title: params.name }],
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

  // Non-blocking server query seeds the react-query cache so mutations
  // (rename, delete) can invalidate correctly. Falls back gracefully offline.
  const { data } = useQuery(
    teamQueries.detail({ organizationSlug: organization, slug: name })
  );

  const status = useMutationState({
    filters: { mutationKey: teamQueries.mutations.delete().mutationKey },
    select: (mutation) => mutation.state.status,
  });

  if (!isLoading && !teamData) {
    throw notFound();
  }

  // Prefer the richer server payload for General (it seeds mutation cache),
  // fall back to the local PowerSync shell offline.
  const team = data ?? (teamData as any);

  return (
    <SettingsContainer key={team?.id ?? name}>
      <BackButton
        to="/$organization/settings/teams"
        variant="ghost"
        className="text-muted-foreground w-fit"
        showTooltip={false}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        <span>Teams</span>
      </BackButton>
      <h1 className="text-foreground text-2xl font-medium">{team?.name ?? ""}</h1>
      {team && (
        <General disabled={status.includes("pending")} team={team} />
      )}
      <Workflow />
      {team && (
        <DangerZone
          disabled={status.includes("pending")}
          team={{ id: team.id, name: team.name }}
        />
      )}
    </SettingsContainer>
  );
}
