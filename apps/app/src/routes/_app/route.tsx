import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { AppSidebar } from "@/components/app-sidebar";
import { useOrganization } from "@/components/organization-context";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, serverContext }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login" });
    }
    return {
      sidebarState: serverContext?.sidebarState,
      session: context.session,
    };
  },
  component: () => {
    return <RouteComponent />;
  },
});

function RouteComponent() {
  const { sidebarState } = Route.useRouteContext();
  const { isPending } = useOrganization();

  return (
    <SidebarProvider
      defaultOpen={sidebarState}
      className="h-svh min-h-0! overflow-hidden"
    >
      <AppSidebar isPending={isPending} />
      <SidebarInset className="min-h-0 overflow-hidden">
        {isPending ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Outlet />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
