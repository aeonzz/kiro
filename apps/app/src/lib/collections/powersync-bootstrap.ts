import * as React from "react";

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
