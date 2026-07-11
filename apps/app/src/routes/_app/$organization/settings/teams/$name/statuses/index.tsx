import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { teamQueries } from "@/lib/query-factory";
import { BackButton } from "@/components/back-button";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";

import { WorkflowStatuses } from "./-components/workflow-statuses";

export const Route = createFileRoute(
  "/_app/$organization/settings/teams/$name/statuses/"
)({
  loader: async ({ params: { organization, name }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueries.detail({ organizationSlug: organization, slug: name })
    );

    if (!data) {
      throw notFound();
    }

    return {
      title: `${data.name} > Issue statuses`,
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

  if (!data) {
    throw notFound();
  }

  return (
    <SettingsContainer key={data.id}>
      <BackButton
        to="/$organization/settings/teams/$name"
        variant="ghost"
        className="text-muted-foreground w-fit"
        showTooltip={false}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        <span>{data?.name}</span>
      </BackButton>
      <div className="space-y-1.5">
        <h1 className="text-foreground text-2xl font-medium">Issue statuses</h1>
        <p className="text-muted-foreground text-xs-plus">
          Issue statuses define the workflow that issues go through from start
          to completion.
        </p>
      </div>
      <WorkflowStatuses states={data.workflowStates} />
    </SettingsContainer>
  );
}
