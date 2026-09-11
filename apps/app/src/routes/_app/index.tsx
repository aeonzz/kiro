import { createFileRoute } from "@tanstack/react-router";

import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

// The root path never renders content of its own — OrganizationProvider decides
// where to send you (into your active org, or /join) once PowerSync has synced.
// Until that redirect fires we'd otherwise show a blank page, so hold a loader.
function RouteComponent() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </main>
  );
}
