import { PowerSyncDatabase } from "@powersync/web";

import { clearOfflineCache } from "@/lib/offline-cache";

import { BackendConnector } from "./connector";
import { AppSchema } from "./schema";

let db: PowerSyncDatabase | null = null;
let connectStarted = false;

/**
 * Lazily create the browser PowerSync database (a WASM SQLite instance backed by
 * IndexedDB). Must never be constructed during SSR — callers reach this only
 * from client-side code. Creation does NOT open the sync connection; see
 * {@link connectPowerSync}.
 */
export function getPowerSyncDb(): PowerSyncDatabase {
  if (typeof window === "undefined") {
    throw new Error("PowerSync database is only available in the browser");
  }

  if (!db) {
    db = new PowerSyncDatabase({
      schema: AppSchema,
      database: { dbFilename: "kiro.db" },
      // Run the WASM SQLite on the main thread instead of a web worker — avoids
      // the Vite worker/WASM asset serving issues. Fine for dev.
      flags: {
        useWebWorker: false,
        enableMultiTabs: false,
      },
    });
  }

  return db;
}

/**
 * Opens the sync connection once. Idempotent — safe to call on every mount
 * (StrictMode/HMR won't churn it). The connection is intentionally NOT torn
 * down on unmount; it's cleared explicitly on sign-out via {@link clearPowerSync}.
 */
export function connectPowerSync() {
  const database = getPowerSyncDb();
  if (connectStarted) return;
  connectStarted = true;
  void database.connect(new BackendConnector());
}

/**
 * Disconnects and wipes all local data. Call on sign-out / user switch so the
 * next user on this device cannot read the previous user's synced rows. Resets
 * the connect guard so the next sign-in reconnects a fresh, empty database.
 */
export async function clearPowerSync() {
  clearOfflineCache();
  if (!db) return;
  await db.disconnectAndClear();
  connectStarted = false;
}
