import * as React from "react";
import { powerSyncCollectionOptions } from "@tanstack/powersync-db-collection";
import { createCollection, useLiveQuery } from "@tanstack/react-db";

import type { Issue } from "@/types/issue";
import { getPowerSyncDb } from "@/lib/powersync/db";
import { AppSchema } from "@/lib/powersync/schema";

function createIssuesPowerSyncCollection() {
  return createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.issue,
    })
  );
}

let collection: ReturnType<typeof createIssuesPowerSyncCollection> | null = null;

/**
 * Memoized PowerSync-backed issues collection. Reads/writes the local SQLite
 * `issue` table; writes are queued and uploaded through the backend connector.
 * Browser-only — the underlying database cannot exist during SSR.
 */
export function getIssuesPowerSyncCollection() {
  if (typeof window === "undefined") {
    throw new Error("PowerSync collection is only available in the browser");
  }

  if (!collection) {
    collection = createIssuesPowerSyncCollection();
  }

  return collection;
}

/**
 * Resolve one issue by the `(teamId, number)` pair the DB keys issues on — the
 * same pair an identifier like `AEO-13` decodes to. Local-first: reads the
 * synced SQLite table, no network.
 *
 * Returns `isLoading` so callers can tell "still hydrating" from "no such
 * issue" rather than flashing a missing title.
 */
export function usePowerSyncIssueByNumber(
  teamId: string | undefined,
  number: number | undefined
): { issue: { id: string; title: string } | null; isLoading: boolean } {
  const collection = React.useMemo(() => getIssuesPowerSyncCollection(), []);

  const { data: issues = [], isLoading } = useLiveQuery(
    (q) => q.from({ issue: collection }),
    [collection]
  );

  const issue = React.useMemo(() => {
    if (!teamId || number === undefined) return null;
    const match = issues.find(
      (row) => row.teamId === teamId && row.number === number
    );
    if (!match) return null;
    return {
      id: match.id as string,
      title: (match.title as string) ?? "",
    };
  }, [issues, teamId, number]);

  return { issue, isLoading };
}

/**
 * Maps a raw synced `issue` row to the denormalized {@link Issue} the UI
 * consumes. The workflow `status` (type) is resolved from the team's workflow
 * states; `labelIds` is joined in from the synced `issue_label_link` table by
 * the caller.
 */
export function powerSyncRowToIssue(
  row: Record<string, unknown>,
  workflowStates: Array<{ id: string; type: string }>,
  labelIds: string[] = []
): Issue {
  const stateId = (row.stateId as string | null) ?? undefined;
  const state = workflowStates.find((s) => s.id === stateId);

  return {
    id: row.id as string,
    number: (row.number as number | null) ?? undefined,
    title: (row.title as string | null) ?? "",
    stateId,
    status: (state?.type ?? "BACKLOG") as Issue["status"],
    priority: ((row.priority as string | null) ?? "NO_PRIORITY") as Issue["priority"],
    assigneeId: (row.assigneeId as string | null) ?? undefined,
    creatorId: (row.creatorId as string | null) ?? undefined,
    projectId: (row.projectId as string | null) ?? undefined,
    parentId: (row.parentId as string | null) ?? undefined,
    labelIds,
    position: (row.position as number | null) ?? undefined,
    createdAt: (row.createdAt as string | null) ?? "",
    updatedAt: (row.updatedAt as string | null) ?? "",
  };
}
