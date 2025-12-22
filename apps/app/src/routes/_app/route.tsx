import * as React from "react";
import { getUserPreferencesFn } from "@/services/user/get";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { usePreferencesStore } from "@/hooks/use-preference-store";

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
  loader: async () => {
    const prefs = await getUserPreferencesFn();

    return { preferences: prefs };
  },
  component: () => {
    return <RouteComponent />;
  },
});

function RouteComponent() {
  const { preferences } = Route.useLoaderData();

  React.useEffect(() => {
    if (preferences) {
      usePreferencesStore.setState(preferences);
    }
  }, [preferences]);

  return <Outlet />;
}
