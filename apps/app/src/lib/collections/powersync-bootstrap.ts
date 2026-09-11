import * as React from "react";

import { getPowerSyncDb } from "@/lib/powersync/db";

import { getIssueLabelLinksCollection } from "./issue-label-links-powersync";
import { getIssuesPowerSyncCollection } from "./issues-powersync";
import {
  getIssueLabelsCollection,
  getMembersCollection,
  getOrganizationsCollection,
  getProjectsCollection,
  getTeamsCollection,
  getUsersCollection,
  getWorkflowStatesCollection,
} from "./team-metadata-powersync";

/**
 * Warm every org-scoped PowerSync collection at once and report when they have
 * all finished their initial local load.
 *
 * Collections are otherwise created lazily — one per route on first access — so
 * the issue collection only starts hydrating when you open the issues route,
 * *after* the sidebar's teams. Creating them all eagerly from app entry means
 * they hydrate in parallel from local SQLite, letting the shell reveal teams and
 * issues together behind a single loading state (no staggered pop-in).
 *
 * `preload()` resolves on the collection's first local load and does not
 * subscribe to data changes, so gating on it won't re-render the app on every
 * write. Browser-only — the collections require the PowerSync database.
 */
export function usePowerSyncReady(): boolean {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const collections = [
      getOrganizationsCollection(),
      getTeamsCollection(),
      getWorkflowStatesCollection(),
      getIssueLabelsCollection(),
      getMembersCollection(),
      getUsersCollection(),
      getProjectsCollection(),
      getIssuesPowerSyncCollection(),
      getIssueLabelLinksCollection(),
    ];

    void Promise.all(collections.map((c) => c.preload())).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}

function subscribeHasSynced(onChange: () => void): () => void {
  const unregister = getPowerSyncDb().registerListener({
    statusChanged: () => onChange(),
  });
  return () => unregister?.();
}

function getHasSyncedSnapshot(): boolean {
  return Boolean(getPowerSyncDb().currentStatus?.hasSynced);
}

/**
 * Reactive `hasSynced` flag read straight from the PowerSync database singleton.
 *
 * Mirrors `@powersync/react`'s `useStatus().hasSynced`, but without depending on
 * `PowerSyncContext` — so it is safe to call in providers that mount *above*
 * `PowerSyncProvider` (e.g. the organization provider). Distinct from
 * `usePowerSyncReady`: that resolves once the local SQLite tables have been read,
 * which can happen before PowerSync has completed its first sync from the server
 * (i.e. against an empty local database). SSR-safe — the server snapshot is
 * `false` and the db (browser-only) is only touched on the client.
 */
export function usePowerSyncHasSynced(): boolean {
  return React.useSyncExternalStore(
    subscribeHasSynced,
    getHasSyncedSnapshot,
    () => false
  );
}
