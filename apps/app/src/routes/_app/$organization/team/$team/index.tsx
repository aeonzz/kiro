import { createFileRoute, redirect } from "@tanstack/react-router";

import { useLastVisitedStore } from "@/hooks/use-last-visited-store";

export const Route = createFileRoute("/_app/$organization/team/$team/")({
  beforeLoad: async ({ params }) => {
    const lastTab = useLastVisitedStore
      .getState()
      .getLastIssueTab(params.organization, params.team);

    throw redirect({
      to: lastTab || "/$organization/team/$team/all",
      params: {
        organization: params.organization,
        team: params.team,
      },
    });
  },
});
