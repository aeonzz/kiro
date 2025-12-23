import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$organization/team/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/",
    });
  },
});
