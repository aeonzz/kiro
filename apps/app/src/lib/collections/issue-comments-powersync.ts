import * as React from "react";
import { powerSyncCollectionOptions } from "@tanstack/powersync-db-collection";
import { createCollection, useLiveQuery } from "@tanstack/react-db";

import { getPowerSyncDb } from "@/lib/powersync/db";
import { AppSchema } from "@/lib/powersync/schema";

function createIssueCommentsPowerSyncCollection() {
  return createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.issue_comment,
    })
  );
}

let collection: ReturnType<
  typeof createIssueCommentsPowerSyncCollection
> | null = null;

/**
 * Memoized PowerSync-backed issue_comment collection. Inserting a row creates
 * a comment; deleting removes it (author-only); updating `resolvedAt` toggles
 * a comment's resolved state; updating `body` edits it (author-only). Writes
 * go to local SQLite and upload to Postgres via the connector (uploadCrudFn /
 * applyIssueCrud handles the `issue_comment` table). Browser-only.
 */
export function getIssueCommentsPowerSyncCollection() {
  if (typeof window === "undefined") {
    throw new Error("PowerSync collection is only available in the browser");
  }

  if (!collection) {
    collection = createIssueCommentsPowerSyncCollection();
  }

  return collection;
}

export type PowerSyncIssueComment = {
  id: string;
  body: string;
  issueId: string;
  userId: string;
  /** Null for a top-level comment; the top-level comment's id for a reply. */
  parentId: string | null;
  /** Set only on a top-level comment once its thread is resolved. */
  resolvedAt: string | null;
  resolvedById: string | null;
  createdAt: string;
  updatedAt: string;
};

const HAS_TIMEZONE = /[Zz]$|[+-]\d{2}:\d{2}$/;

/** See the identical helper in issue-history-powersync.ts for why this is needed. */
function normalizeUtcTimestamp(value: string): string {
  if (!value || HAS_TIMEZONE.test(value)) return value;
  return `${value.replace(" ", "T")}Z`;
}

/**
 * An issue's comments, oldest first, read from local SQLite. Updates as soon
 * as the synced-down row lands — no server round trip from the reading
 * client for comments other actors post.
 */
export function usePowerSyncIssueComments(
  issueId: string | undefined
): PowerSyncIssueComment[] {
  const collection = React.useMemo(
    () => getIssueCommentsPowerSyncCollection(),
    []
  );

  const { data = [] } = useLiveQuery(
    (q) => q.from({ comment: collection }),
    [collection]
  );

  return React.useMemo(() => {
    if (!issueId) return [];
    return data
      .filter((row) => row.issueId === issueId)
      .map((row) => ({
        id: row.id as string,
        body: (row.body as string) ?? "",
        issueId: row.issueId as string,
        userId: row.userId as string,
        parentId: (row.parentId as string | null) ?? null,
        resolvedAt: row.resolvedAt
          ? normalizeUtcTimestamp(row.resolvedAt as string)
          : null,
        resolvedById: (row.resolvedById as string | null) ?? null,
        createdAt: normalizeUtcTimestamp((row.createdAt as string) ?? ""),
        updatedAt: normalizeUtcTimestamp(
          (row.updatedAt as string | null) ?? (row.createdAt as string) ?? ""
        ),
      }))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [data, issueId]);
}

/** Posts a comment on an issue — a top-level comment when `parentId` is
 * omitted, or a reply to that top-level comment otherwise. */
export function createIssueComment(
  issueId: string,
  userId: string,
  body: string,
  parentId: string | null = null
) {
  const now = new Date().toISOString();
  getIssueCommentsPowerSyncCollection().insert({
    id: crypto.randomUUID(),
    body,
    issueId,
    userId,
    parentId,
    createdAt: now,
    updatedAt: now,
  });
}

/** Marks a top-level comment's thread resolved. `resolvedById` is set
 * server-side from the acting user — the client value is ignored there. */
export function resolveIssueComment(commentId: string, userId: string) {
  getIssueCommentsPowerSyncCollection().update(commentId, (draft) => {
    draft.resolvedAt = new Date().toISOString();
    draft.resolvedById = userId;
  });
}

/** Reopens a resolved thread. */
export function unresolveIssueComment(commentId: string) {
  getIssueCommentsPowerSyncCollection().update(commentId, (draft) => {
    draft.resolvedAt = null;
    draft.resolvedById = null;
  });
}

/** Deletes a comment — server-side rejects it unless the caller is the author. */
export function deleteIssueComment(commentId: string) {
  getIssueCommentsPowerSyncCollection().delete(commentId);
}

/** Edits a comment's body — server-side rejects it unless the caller is the
 * author. */
export function editIssueComment(commentId: string, body: string) {
  getIssueCommentsPowerSyncCollection().update(commentId, (draft) => {
    draft.body = body;
    draft.updatedAt = new Date().toISOString();
  });
}
