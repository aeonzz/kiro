import * as React from "react";
import { getUserPreferencesFn } from "@/services/user/get";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";

import { usePreferencesStore } from "@/hooks/use-preference-store";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { AppSidebar } from "@/components/app-sidebar";
import { useOrganization } from "@/components/organization-context";
import { SettingsSidebar } from "@/components/settings-sidebar";

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
  loader: async ({}) => {
    const prefs = await getUserPreferencesFn();

    return { preferences: prefs };
  },
  component: () => {
    return <RouteComponent />;
  },
});

function RouteComponent() {
  const { sidebarState } = Route.useRouteContext();
  const { preferences } = Route.useLoaderData();
  const { isPending } = useOrganization();
  const location = useLocation();

  React.useEffect(() => {
    if (preferences) {
      usePreferencesStore.setState(preferences);
    }
  }, [preferences]);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isSettings = pathSegments[1] === "settings";

  return (
    <SidebarProvider
      defaultOpen={sidebarState}
      className="h-svh min-h-0! overflow-hidden"
    >
      {isSettings ? (
        <SettingsSidebar isPending={isPending} />
      ) : (
        <AppSidebar isPending={isPending} />
      )}
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
