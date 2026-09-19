import * as React from "react";
import { powerSyncCollectionOptions } from "@tanstack/powersync-db-collection";
import { createCollection, useLiveQuery } from "@tanstack/react-db";

import { getPowerSyncDb } from "@/lib/powersync/db";
import { AppSchema } from "@/lib/powersync/schema";

function createIssueHistoryPowerSyncCollection() {
  return createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.issue_history,
    })
  );
}

let collection: ReturnType<typeof createIssueHistoryPowerSyncCollection> | null =
  null;

/**
 * Memoized PowerSync-backed issue_history collection. Sync-down only — rows
 * are created server-side by applyIssueCrud, never written from the client.
 * Browser-only — the underlying database cannot exist during SSR.
 */
export function getIssueHistoryPowerSyncCollection() {
  if (typeof window === "undefined") {
    throw new Error("PowerSync collection is only available in the browser");
  }

  if (!collection) {
    collection = createIssueHistoryPowerSyncCollection();
  }

  return collection;
}

export type PowerSyncIssueHistoryEntry = {
  id: string;
  actorId: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
};

const HAS_TIMEZONE = /[Zz]$|[+-]\d{2}:\d{2}$/;

/**
 * `issue_history.createdAt` is a Postgres `timestamp without time zone`
 * column (holding UTC wall-clock values, since the DB session runs in UTC).
 * PowerSync syncs it down as bare text with no "Z"/offset, so `new Date()`
 * on it would parse as local time and skew the value by the viewer's UTC
 * offset. Tag it UTC explicitly before it ever reaches a `Date`/formatter.
 */
function normalizeUtcTimestamp(value: string): string {
  if (!value || HAS_TIMEZONE.test(value)) return value;
  return `${value.replace(" ", "T")}Z`;
}

/**
 * An issue's history entries, oldest first, read from local SQLite. Updates
 * as soon as the synced-down row lands — no server round trip from the
 * reading client, since PowerSync pushed it down already.
 */
export function usePowerSyncIssueHistory(
  issueId: string | undefined
): PowerSyncIssueHistoryEntry[] {
  const collection = React.useMemo(
    () => getIssueHistoryPowerSyncCollection(),
    []
  );

  const { data = [] } = useLiveQuery(
    (q) => q.from({ entry: collection }),
    [collection]
  );

  return React.useMemo(() => {
    if (!issueId) return [];
    return data
      .filter((row) => row.issueId === issueId)
      .map((row) => ({
        id: row.id as string,
        actorId: row.actorId as string,
        field: row.field as string,
        oldValue: (row.oldValue as string | null) ?? null,
        newValue: (row.newValue as string | null) ?? null,
        createdAt: normalizeUtcTimestamp((row.createdAt as string) ?? ""),
      }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [data, issueId]);
}
