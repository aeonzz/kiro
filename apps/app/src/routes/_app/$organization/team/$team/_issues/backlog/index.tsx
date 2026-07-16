import { createFileRoute } from "@tanstack/react-router";

import { ContainerContent } from "@/components/container";
import { Error } from "@/components/error";

// import { DetailsSidePanel } from "../-components/details-side-panel";

export const Route = createFileRoute(
  "/_app/$organization/team/$team/_issues/backlog/"
)({
  head: ({ params }) => ({
    meta: [{ title: `${params.team} · Backlog` }],
  }),
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  // The parent `_issues` route validates the team locally; this leaf only needs
  // to render its content (no network / no server team query).
  return (
    <ContainerContent className="flex">
      <div className="flex-1"></div>
    </ContainerContent>
  );
}
