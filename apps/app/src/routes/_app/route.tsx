import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { AppSidebar } from "@/components/app-sidebar";
import { useOrganization } from "@/components/organization-context";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login" });
    }
    return { session: context.session };
  },
  component: () => {
    const defaultOpen =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("sidebar_state="))
        ?.split("=")[1] === "true";

    return <RouteComponent defaultOpen={defaultOpen} />;
  },
});

function RouteComponent({ defaultOpen }: { defaultOpen: boolean }) {
  const { isPending } = useOrganization();

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
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
