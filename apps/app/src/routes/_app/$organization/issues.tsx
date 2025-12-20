import { createFileRoute } from "@tanstack/react-router";

import { ComponentExample } from "@/components/component-example";

export const Route = createFileRoute("/_app/$organization/issues")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComponentExample />;
}
