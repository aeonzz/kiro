import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login" });
    }
    return { session: context.session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
