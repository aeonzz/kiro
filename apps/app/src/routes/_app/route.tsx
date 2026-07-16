import * as React from "react";
import { getUserPreferencesFn } from "@/services/user/get";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import {
  PREFERENCES_CACHE_KEY,
  readOfflineCache,
  writeOfflineCache,
} from "@/lib/offline-cache";
import { PowerSyncProvider } from "@/lib/powersync/provider";
import { usePreferencesStore } from "@/hooks/use-preference-store";

type Preferences = Awaited<ReturnType<typeof getUserPreferencesFn>>;

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
    // Server RPC — rejects offline. Fall back to the last known preferences so
    // entering the app locally doesn't error; empty object if nothing cached.
    try {
      const preferences = await getUserPreferencesFn();
      writeOfflineCache(PREFERENCES_CACHE_KEY, preferences);
      return { preferences };
    } catch (err) {
      const cached = readOfflineCache<Preferences>(PREFERENCES_CACHE_KEY);
      if (cached) {
        return { preferences: cached };
      }
      throw err;
    }
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

  return (
    <PowerSyncProvider>
      <Outlet />
    </PowerSyncProvider>
  );
}
