import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/$organization/team/$team/projects/"
)({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$organization/team/$team/projects/all",
      params: {
        organization: params.organization,
        team: params.team,
      },
    });
  },
});
