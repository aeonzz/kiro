import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$organization/settings/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$organization/settings/account",
      params: {
        organization: params.organization,
      },
    });
  },
});
