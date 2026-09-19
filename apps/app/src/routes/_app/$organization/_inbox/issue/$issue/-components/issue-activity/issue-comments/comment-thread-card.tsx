import * as React from "react";
import {
  CheckmarkCircle02Icon,
  UnfoldLessIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { PowerSyncCommentReaction } from "@/lib/collections/issue-comment-reactions-powersync";
import type { PowerSyncIssueComment } from "@/lib/collections/issue-comments-powersync";
import type { PowerSyncMemberOption } from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CommentCard } from "./comment-card";
import { CommentComposer } from "./comment-composer";
import { CommentContextMenu, type CommentMenuProps } from "./comment-menu";
import type { CommentThread } from "./group-comment-threads";

export function CommentThreadCard({
  thread,
  memberById,
  avatarUrl,
  avatarLabel,
  currentUserId,
  onReply,
  onResolve,
  onUnresolve,
  onDelete,
  onEdit,
  editingCommentId,
  onEditingChange,
  reactionsByComment,
  onToggleReaction,
}: {
  thread: CommentThread;
  memberById: Map<string, PowerSyncMemberOption>;
  avatarUrl?: string;
  avatarLabel: string;
  currentUserId: string;
  onReply: (parentId: string, body: string) => void;
  onResolve: (commentId: string) => void;
  onUnresolve: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, body: string) => void;
  /** Shared across every thread on the issue, not just this one — only one
   * comment anywhere can be in edit mode at a time. */
  editingCommentId: string | null;
  onEditingChange: (commentId: string, editing: boolean) => void;
  reactionsByComment: Map<string, PowerSyncCommentReaction[]>;
  onToggleReaction: (commentId: string, emoji: string) => void;
}) {
  const authorLabel = (userId: string) =>
    memberById.get(userId)?.label ?? "Someone";

  const rootResolved = Boolean(thread.root.resolvedAt);
  const resolvedReplies = thread.replies.filter((reply) => reply.resolvedAt);
  const unresolvedReplies = thread.replies.filter((reply) => !reply.resolvedAt);

  const resolvedCommentId = rootResolved
    ? thread.root.id
    : (resolvedReplies[0]?.id ?? null);
  const anyResolved = resolvedCommentId !== null;

  const collapseWholeThread = rootResolved;
  const collapseReplies =
    !rootResolved && resolvedReplies.length > 0 && unresolvedReplies.length > 0;
  const isResolvable = collapseWholeThread || collapseReplies;

  const [open, setOpen] = React.useState(false);
  const wasResolvable = React.useRef(isResolvable);
  React.useEffect(() => {
    if (isResolvable && !wasResolvable.current) setOpen(false);
    wasResolvable.current = isResolvable;
  }, [isResolvable]);

  // Whether the comment currently being edited (if any) belongs to THIS
  // thread — scopes muting to the active thread instead of dimming every
  // other thread on the issue too.
  const isThisThreadEditing =
    editingCommentId !== null &&
    (editingCommentId === thread.root.id ||
      thread.replies.some((reply) => reply.id === editingCommentId));

  function renderComment(comment: PowerSyncIssueComment, nested: boolean) {
    return (
      <CommentCard
        key={comment.id}
        comment={comment}
        author={memberById.get(comment.userId)}
        nested={nested}
        replies={nested ? undefined : thread.replies}
        currentUserId={currentUserId}
        authorLabel={authorLabel}
        onResolve={() => onResolve(comment.id)}
        onUnresolve={() => onUnresolve(comment.id)}
        onDelete={() => onDelete(comment.id)}
        onEditBody={(body) => onEdit(comment.id, body)}
        isEditing={editingCommentId === comment.id}
        onEditingChange={(editing) => onEditingChange(comment.id, editing)}
        editDisabled={
          editingCommentId !== null && editingCommentId !== comment.id
        }
        muted={isThisThreadEditing && editingCommentId !== comment.id}
        reactions={reactionsByComment.get(comment.id)}
        onToggleReaction={(emoji) => onToggleReaction(comment.id, emoji)}
      />
    );
  }

  function renderRoot() {
    return (
      <CommentCard
        key={thread.root.id}
        comment={thread.root}
        author={memberById.get(thread.root.userId)}
        nested={false}
        replies={thread.replies}
        currentUserId={currentUserId}
        authorLabel={authorLabel}
        threadResolved={anyResolved}
        onResolve={() => onResolve(thread.root.id)}
        onUnresolve={() => onUnresolve(resolvedCommentId ?? thread.root.id)}
        onDelete={() => onDelete(thread.root.id)}
        onEditBody={(body) => onEdit(thread.root.id, body)}
        isEditing={editingCommentId === thread.root.id}
        onEditingChange={(editing) => onEditingChange(thread.root.id, editing)}
        editDisabled={
          editingCommentId !== null && editingCommentId !== thread.root.id
        }
        muted={isThisThreadEditing && editingCommentId !== thread.root.id}
        reactions={reactionsByComment.get(thread.root.id)}
        onToggleReaction={(emoji) => onToggleReaction(thread.root.id, emoji)}
      />
    );
  }

  const rootMenuProps: CommentMenuProps = {
    comment: thread.root,
    replies: thread.replies,
    canDelete: thread.root.userId === currentUserId,
    canEdit: false,
    isRoot: true,
    resolved: anyResolved,
    authorLabel,
    onResolve: () => onResolve(thread.root.id),
    onUnresolve: () => onUnresolve(resolvedCommentId ?? thread.root.id),
    onDelete: () => onDelete(thread.root.id),
    onEdit: () => {},
  };

  const replyComposer = (
    <div
      className={cn(
        "bg-card relative border-t px-3 py-2",
        isThisThreadEditing && "pointer-events-none"
      )}
    >
      <CommentComposer
        variant="inline"
        avatarUrl={avatarUrl}
        avatarLabel={avatarLabel}
        placeholder="Leave a reply..."
        onSubmit={(body) => onReply(thread.root.id, body)}
      />
      <div
        className={cn(
          "bg-card/50 absolute inset-0 transition-opacity",
          isThisThreadEditing ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
    </div>
  );

  const cardClassName =
    "shadow-border-sm divide-border flex flex-col divide-y rounded-lg overflow-hidden";

  // Root resolved — collapse the entire thread into a single summary row.
  if (collapseWholeThread) {
    const commentCount = 1 + thread.replies.length;

    return (
      <Collapsible open={open} onOpenChange={setOpen} className={cardClassName}>
        <CommentContextMenu {...rootMenuProps}>
          <Tooltip>
            <TooltipTrigger
              render={
                <CollapsibleTrigger
                  className="bg-card flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[color-mix(in_oklab,var(--card)95%,var(--card-foreground))]"
                  render={<button type="button" />}
                >
                  {!open && (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="text-muted-foreground size-4 shrink-0"
                    />
                  )}
                  <span className="text-muted-foreground min-w-0 truncate text-sm">
                    {open
                      ? "Collapse"
                      : `${commentCount} resolved comment${commentCount === 1 ? "" : "s"} from ${authorLabel(thread.root.userId)}`}
                  </span>
                  <HugeiconsIcon
                    icon={open ? UnfoldLessIcon : UnfoldMoreIcon}
                    className="text-muted-foreground ml-auto size-4 shrink-0"
                  />
                </CollapsibleTrigger>
              }
            />
            <TooltipContent>
              <p className="text-xs">
                {open ? "Collapse thread" : "Expand thread"}
              </p>
            </TooltipContent>
          </Tooltip>
        </CommentContextMenu>
        <CollapsibleContent>
          <div className="divide-border flex flex-col divide-y">
            {renderRoot()}
            {thread.replies.map((reply) => renderComment(reply, true))}
            {replyComposer}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (collapseReplies) {
    return (
      <div className={cardClassName}>
        {renderRoot()}
        <Collapsible open={open} onOpenChange={setOpen}>
          <CommentContextMenu {...rootMenuProps}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <CollapsibleTrigger
                    className="bg-card flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[color-mix(in_oklab,var(--card)95%,var(--card-foreground))]"
                    render={<button type="button" />}
                  >
                    {!open && (
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        className="text-muted-foreground size-4 shrink-0"
                      />
                    )}
                    <span className="text-muted-foreground min-w-0 truncate text-sm">
                      {open
                        ? "Collapse"
                        : `${unresolvedReplies.length} comment${unresolvedReplies.length === 1 ? "" : "s"} from ${authorLabel(thread.root.userId)}`}
                    </span>
                    <HugeiconsIcon
                      icon={open ? UnfoldLessIcon : UnfoldMoreIcon}
                      className="text-muted-foreground ml-auto size-4 shrink-0"
                    />
                  </CollapsibleTrigger>
                }
              />
              <TooltipContent>
                <p className="text-xs">
                  {open ? "Collapse thread" : "Expand thread"}
                </p>
              </TooltipContent>
            </Tooltip>
          </CommentContextMenu>
          <CollapsibleContent>
            <div className="divide-border flex flex-col divide-y">
              {thread.replies.map((reply) => renderComment(reply, true))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        {!open && resolvedReplies.map((reply) => renderComment(reply, true))}
        {replyComposer}
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      {renderRoot()}
      {thread.replies.map((reply) => renderComment(reply, true))}
      {replyComposer}
    </div>
  );
}
