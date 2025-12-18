import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$organization/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$organization/inbox",
      params: {
        organization: params.organization,
      },
    });
  },
});
