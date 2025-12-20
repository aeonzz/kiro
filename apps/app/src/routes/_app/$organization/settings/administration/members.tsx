import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/$organization/settings/administration/members"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/_app/$organization/settings/administration/members"!</div>
  );
}
