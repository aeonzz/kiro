import {
  UpdateType,
  type AbstractPowerSyncDatabase,
  type PowerSyncBackendConnector,
  type PowerSyncCredentials,
} from "@powersync/web";

import { authClient } from "@/lib/auth-client";
import { getPowerSyncTokenFn, uploadCrudFn } from "@/services/powersync/server-fn";

const POWERSYNC_URL = import.meta.env.VITE_POWERSYNC_URL as string | undefined;
// Dev-only: a PowerSync dashboard development token. When set, it bypasses the
// server token flow so you can test sync before real (JWKS) auth is wired up.
// Temporary and expiring — do not use in production.
const DEV_TOKEN = import.meta.env.VITE_POWERSYNC_TOKEN as string | undefined;

/**
 * Connects the local PowerSync database to our backend:
 * - `fetchCredentials` hands PowerSync a fresh JWT + the service endpoint.
 * - `uploadData` replays the local write queue to Postgres via server functions.
 */
export class BackendConnector implements PowerSyncBackendConnector {
  async fetchCredentials(): Promise<PowerSyncCredentials | null> {
    if (!POWERSYNC_URL) {
      throw new Error("VITE_POWERSYNC_URL is not configured");
    }

    // Not signed in -> return null so PowerSync stops syncing instead of
    // retrying with a stale token. Local data is wiped on sign-out via
    // clearPowerSync(), so nothing sensitive remains on the device.
    const { data: session } = await authClient.getSession();
    if (!session?.user) {
      return null;
    }

    // Dev short-circuit: use the dashboard development token if provided.
    if (DEV_TOKEN) {
      return { endpoint: POWERSYNC_URL, token: DEV_TOKEN };
    }

    // Server fn is authed; if the user isn't signed in it throws, and PowerSync
    // treats a thrown error as a temporary failure (it retries). A truly
    // signed-out state should surface as `null` — adapt if your auth exposes it.
    const token = await getPowerSyncTokenFn();

    if (!token) {
      return null;
    }

    return {
      endpoint: POWERSYNC_URL,
      token,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    const ops = transaction.crud.map((entry) => ({
      op: entry.op as UpdateType,
      table: entry.table,
      id: entry.id,
      data: entry.opData ?? {},
    }));

    try {
      await uploadCrudFn({ data: { ops } });
      // Only clear the queue once the backend has durably accepted the batch.
      await transaction.complete();
    } catch (error) {
      // Rethrow so PowerSync retries after its backoff. NOTE: a permanent
      // (e.g. validation/authorization) failure would loop forever here — when
      // you add such cases, detect them and `transaction.complete()` to discard
      // the bad batch instead of rethrowing.
      throw error;
    }
  }
}
