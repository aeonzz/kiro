import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutationState, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { BackButton } from "@/components/back-button";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";

import { DangerZone } from "./-components/danger-zone";
import { General } from "./-components/general";

export const Route = createFileRoute(
  "/_app/$organization/settings/teams/$name/"
)({
  loader: async ({ params: { organization, name }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueries.detail({ organizationSlug: organization, slug: name })
    );

    if (!data) {
      throw notFound();
    }

    return {
      title: `${data.name} > Overview`,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : undefined,
  }),
  errorComponent: Error,
  notFoundComponent: () => {
    return <NotFound />;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { name, organization } = Route.useParams();

  const { data } = useSuspenseQuery(
    teamQueries.detail({ organizationSlug: organization, slug: name })
  );

  const status = useMutationState({
    filters: { mutationKey: teamQueries.mutations.delete().mutationKey },
    select: (mutation) => mutation.state.status,
  });

  if (!data) {
    throw notFound();
  }

  return (
    <SettingsContainer key={data.id}>
      <BackButton
        to="/$organization/settings/teams"
        variant="ghost"
        className="text-muted-foreground w-fit"
        showTooltip={false}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        <span>Teams</span>
      </BackButton>
      <h1 className="text-foreground text-2xl font-medium">{data.name}</h1>
      <General disabled={status.includes("pending")} team={data} />
      <DangerZone
        disabled={status.includes("pending")}
        team={{ id: data.id, name: data.name }}
      />
    </SettingsContainer>
  );
}
