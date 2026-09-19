import * as React from "react";
import { powerSyncCollectionOptions } from "@tanstack/powersync-db-collection";
import { createCollection, useLiveQuery } from "@tanstack/react-db";

import { getPowerSyncDb } from "@/lib/powersync/db";
import { AppSchema } from "@/lib/powersync/schema";

function createIssueCommentReactionsPowerSyncCollection() {
  return createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.issue_comment_reaction,
    })
  );
}

let collection: ReturnType<
  typeof createIssueCommentReactionsPowerSyncCollection
> | null = null;

/**
 * Memoized PowerSync-backed issue_comment_reaction collection. Inserting a
 * row adds a reaction; deleting removes it (author-only). A user can react to
 * a comment with a given emoji at most once (enforced by a unique constraint
 * server-side). Browser-only.
 */
export function getIssueCommentReactionsPowerSyncCollection() {
  if (typeof window === "undefined") {
    throw new Error("PowerSync collection is only available in the browser");
  }

  if (!collection) {
    collection = createIssueCommentReactionsPowerSyncCollection();
  }

  return collection;
}

export type PowerSyncCommentReaction = {
  id: string;
  commentId: string;
  issueId: string;
  userId: string;
  emoji: string;
  createdAt: string;
};

/** All reactions across every comment on an issue, read from local SQLite. */
export function usePowerSyncIssueCommentReactions(
  issueId: string | undefined
): PowerSyncCommentReaction[] {
  const collection = React.useMemo(
    () => getIssueCommentReactionsPowerSyncCollection(),
    []
  );

  const { data = [] } = useLiveQuery(
    (q) => q.from({ reaction: collection }),
    [collection]
  );

  return React.useMemo(() => {
    if (!issueId) return [];
    return data
      .filter((row) => row.issueId === issueId)
      .map((row) => ({
        id: row.id as string,
        commentId: row.commentId as string,
        issueId: row.issueId as string,
        userId: row.userId as string,
        emoji: row.emoji as string,
        createdAt: (row.createdAt as string) ?? "",
      }));
  }, [data, issueId]);
}

/** Adds the acting user's reaction to a comment (no-ops server-side if it
 * already exists). */
export function addCommentReaction(
  commentId: string,
  issueId: string,
  userId: string,
  emoji: string
) {
  getIssueCommentReactionsPowerSyncCollection().insert({
    id: crypto.randomUUID(),
    commentId,
    issueId,
    userId,
    emoji,
    createdAt: new Date().toISOString(),
  });
}

/** Removes a reaction by its row id — server-side rejects it unless the
 * caller is the one who reacted. */
export function removeCommentReaction(reactionId: string) {
  getIssueCommentReactionsPowerSyncCollection().delete(reactionId);
}
