import * as React from "react";
import { PowerSyncContext } from "@powersync/react";

import { connectPowerSync, getPowerSyncDb } from "./db";

/**
 * Opens the local PowerSync sync connection on the client, once per app
 * lifetime (idempotent — no churn under StrictMode/HMR, no disconnect on
 * unmount). The connection is torn down and local data wiped only on sign-out
 * via clearPowerSync. Browser-only: the effect never runs during SSR.
 *
 * Also provides PowerSyncContext so @powersync/react hooks (useStatus, useQuery, …)
 * work anywhere in the tree.
 */
export function PowerSyncProvider({ children }: { children: React.ReactNode }) {
  const db = getPowerSyncDb();

  React.useEffect(() => {
    connectPowerSync();
  }, []);

  return (
    <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider>
  );
}
