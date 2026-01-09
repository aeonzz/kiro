import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { authQueries } from "@/lib/query-factory";
import { Error } from "@/components/error";
import { NotFound } from "@/components/not-found";
import SettingsContainer from "@/components/settings/settings-container";

import { Sessions } from "./-components/sessions";

export const Route = createFileRoute(
  "/_app/$organization/settings/account/security/"
)({
  loader: async ({ params: { organization }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      authQueries.sessions()
    );

    if (!data) {
      throw notFound();
    }
  },
  head: () => ({
    meta: [{ title: "Security & access", description: "Security & access" }],
  }),
  errorComponent: Error,
  notFoundComponent: () => {
    return <NotFound />;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: sessions } = useSuspenseQuery(authQueries.sessions());

  return (
    <SettingsContainer>
      <h1 className="text-foreground text-2xl font-medium">
        Security & access
      </h1>
      <Sessions sessions={sessions?.data || []} />
    </SettingsContainer>
  );
}
