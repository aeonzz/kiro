import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/$organization/settings/account/notifications"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/$organization/settings/account/notifications"!</div>;
}
