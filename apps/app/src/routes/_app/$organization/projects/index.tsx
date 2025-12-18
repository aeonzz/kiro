import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$organization/projects/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$organization/projects/all",
      params: {
        organization: params.organization,
      },
    });
  },
});
