import { powerSyncCollectionOptions } from "@tanstack/powersync-db-collection";
import { createCollection } from "@tanstack/react-db";

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
    labelIds,
    createdAt: (row.createdAt as string | null) ?? "",
    updatedAt: (row.updatedAt as string | null) ?? "",
  };
}
