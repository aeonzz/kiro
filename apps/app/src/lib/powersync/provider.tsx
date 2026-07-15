import * as React from "react";

import { connectPowerSync } from "./db";

/**
 * Opens the local PowerSync sync connection on the client, once per app
 * lifetime (idempotent — no churn under StrictMode/HMR, no disconnect on
 * unmount). The connection is torn down and local data wiped only on sign-out
 * via clearPowerSync. Browser-only: the effect never runs during SSR.
 */
export function PowerSyncProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    connectPowerSync();
  }, []);

  return <>{children}</>;
}
