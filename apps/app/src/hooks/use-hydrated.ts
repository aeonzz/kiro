import * as React from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first (hydration) render, then `true` once
 * mounted on the client. Uses `useSyncExternalStore` so there's no extra render
 * from an effect + setState, and the hydration render stays consistent with the
 * server output. Use it to gate browser-only work (e.g. PowerSync reads).
 */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
