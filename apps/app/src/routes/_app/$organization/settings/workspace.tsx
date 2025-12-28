import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/$organization/settings/workspace"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/_app/$organization/settings/administration/workspace"!</div>
  );
}
