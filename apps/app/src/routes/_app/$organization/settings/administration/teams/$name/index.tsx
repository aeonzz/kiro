import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/$organization/settings/administration/teams/$name/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>wtf</div>;
}
