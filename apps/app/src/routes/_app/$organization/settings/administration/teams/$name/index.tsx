import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings-container";

import { General } from "./-general";
import { DangerZone } from "./-general/danger-zone";
import { teamQueryOptions } from "./-queries";

export const Route = createFileRoute(
  "/_app/$organization/settings/administration/teams/$name/"
)({
  loader: async ({ params: { organization, name }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueryOptions({ organizationSlug: organization, slug: name })
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
    teamQueryOptions({ organizationSlug: organization, slug: name })
  );

  return (
    <SettingsContainer key={data!.id}>
      <h1 className="text-foreground text-2xl font-medium">{data?.name}</h1>
      <General team={data!} />
      <DangerZone />
    </SettingsContainer>
  );
}
