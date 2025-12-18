import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$organization/views/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$organization/views/issues",
      params: {
        organization: params.organization,
      },
    });
  },
});
