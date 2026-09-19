import * as React from "react";

import {
  addCommentReaction,
  removeCommentReaction,
  usePowerSyncIssueCommentReactions,
} from "@/lib/collections/issue-comment-reactions-powersync";
import {
  createIssueComment,
  deleteIssueComment,
  editIssueComment,
  resolveIssueComment,
  unresolveIssueComment,
  usePowerSyncIssueComments,
} from "@/lib/collections/issue-comments-powersync";
import { usePowerSyncOrgMembers } from "@/lib/collections/team-metadata-powersync";
import { useAuthenticatedSession } from "@/hooks/use-session";

import { CommentComposer } from "./comment-composer";
import { CommentThreadCard } from "./comment-thread-card";
import { groupCommentThreads } from "./group-comment-threads";

export function IssueComments({
  issueId,
  organization,
}: {
  issueId: string;
  organization: string;
}) {
  const session = useAuthenticatedSession();
  const comments = usePowerSyncIssueComments(issueId);
  const reactions = usePowerSyncIssueCommentReactions(issueId);
  const members = usePowerSyncOrgMembers(organization);

  const memberById = React.useMemo(
    () => new Map(members.map((member) => [member.value, member])),
    [members]
  );

  const currentUser = session.user;
  const currentUserLabel = currentUser.name || currentUser.email || "You";

  const threads = React.useMemo(
    () => groupCommentThreads(comments),
    [comments]
  );

  const reactionsByComment = React.useMemo(() => {
    const map = new Map<string, typeof reactions>();
    for (const reaction of reactions) {
      const existing = map.get(reaction.commentId);
      if (existing) {
        existing.push(reaction);
      } else {
        map.set(reaction.commentId, [reaction]);
      }
    }
    return map;
  }, [reactions]);

  const handleToggleReaction = React.useCallback(
    (commentId: string, emoji: string) => {
      const existing = reactions.find(
        (reaction) =>
          reaction.commentId === commentId &&
          reaction.userId === currentUser.id &&
          reaction.emoji === emoji
      );
      if (existing) {
        removeCommentReaction(existing.id);
      } else {
        addCommentReaction(commentId, issueId, currentUser.id, emoji);
      }
    },
    [reactions, issueId, currentUser.id]
  );

  const submitComment = React.useCallback(
    (body: string, parentId: string | null = null) => {
      createIssueComment(issueId, currentUser.id, body, parentId);
    },
    [issueId, currentUser.id]
  );

  const handleResolve = React.useCallback(
    (commentId: string) => resolveIssueComment(commentId, currentUser.id),
    [currentUser.id]
  );

  // Global across every thread on the issue — only one comment can be in
  // edit mode at a time, matching Linear.
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(
    null
  );
  const handleEditingChange = React.useCallback(
    (commentId: string, editing: boolean) =>
      setEditingCommentId(editing ? commentId : null),
    []
  );

  return (
    <div className="flex flex-col gap-5 px-7">
      {threads.map((thread) => (
        <CommentThreadCard
          key={thread.root.id}
          thread={thread}
          memberById={memberById}
          avatarUrl={currentUser.image ?? undefined}
          avatarLabel={currentUserLabel}
          currentUserId={currentUser.id}
          onReply={(parentId, body) => submitComment(body, parentId)}
          onResolve={handleResolve}
          onUnresolve={unresolveIssueComment}
          onDelete={deleteIssueComment}
          onEdit={editIssueComment}
          editingCommentId={editingCommentId}
          onEditingChange={handleEditingChange}
          reactionsByComment={reactionsByComment}
          onToggleReaction={handleToggleReaction}
        />
      ))}
      <CommentComposer
        variant="standalone"
        avatarUrl={currentUser.image ?? undefined}
        avatarLabel={currentUserLabel}
        placeholder="Leave a comment..."
        onSubmit={(body) => submitComment(body)}
      />
    </div>
  );
}
