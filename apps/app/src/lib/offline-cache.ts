/**
 * Tiny localStorage-backed cache for the route-lifecycle data that would
 * otherwise require a network round-trip on every navigation (session,
 * preferences). Route loaders/beforeLoad fall back to these values when the
 * server function fails (offline), so navigation keeps working locally.
 *
 * All helpers are no-ops during SSR (no `window`). The cache holds only data the
 * client already has access to, and is wiped on sign-out via clearOfflineCache.
 */

export const SESSION_CACHE_KEY = "kiro.session";
export const PREFERENCES_CACHE_KEY = "kiro.preferences";

export function writeOfflineCache(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore quota / serialization / privacy-mode failures — the cache is a
    // best-effort optimization, never a correctness requirement.
  }
}

export function readOfflineCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Clear every offline-cached value. Call on sign-out / user switch. */
export function clearOfflineCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_CACHE_KEY);
    localStorage.removeItem(PREFERENCES_CACHE_KEY);
  } catch {
    // ignore
  }
}
