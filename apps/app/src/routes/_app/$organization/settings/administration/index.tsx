import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/$organization/settings/administration/"
)({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$organization/settings/account/preferences",
      params: {
        organization: params.organization,
      },
    });
  },
});
