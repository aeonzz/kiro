import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$organization/my-issues/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/$organization/my-issues/assigned",
      params: {
        organization: params.organization,
      },
    });
  },
});
