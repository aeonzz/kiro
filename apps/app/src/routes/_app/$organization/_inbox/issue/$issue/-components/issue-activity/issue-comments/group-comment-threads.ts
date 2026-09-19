import type { PowerSyncIssueComment } from "@/lib/collections/issue-comments-powersync";

/** A top-level comment plus its replies, oldest first. Threading is one
 * level deep — a reply can't itself have replies (enforced server-side too,
 * see applyIssueCrud). */
export type CommentThread = {
  root: PowerSyncIssueComment;
  replies: PowerSyncIssueComment[];
};

export function groupCommentThreads(
  comments: PowerSyncIssueComment[]
): CommentThread[] {
  const roots = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, PowerSyncIssueComment[]>();
  for (const comment of comments) {
    if (!comment.parentId) continue;
    const list = repliesByParent.get(comment.parentId) ?? [];
    list.push(comment);
    repliesByParent.set(comment.parentId, list);
  }

  return roots.map((root) => ({
    root,
    replies: repliesByParent.get(root.id) ?? [],
  }));
}
