import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import type { PowerSyncCommentReaction } from "@/lib/collections/issue-comment-reactions-powersync";
import type { PowerSyncIssueComment } from "@/lib/collections/issue-comments-powersync";
import type { PowerSyncMemberOption } from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { UserHoverCard } from "@/components/user-hover-card";

import { CommentContextMenu, CommentMenu } from "./comment-menu";
import { CommentReactions } from "./comment-reactions";
import { formatCommentTime } from "./format-comment-time";

function CommentEditForm({
  initialBody,
  onSave,
  onCancel,
}: {
  initialBody: string;
  onSave: (body: string) => void;
  onCancel: () => void;
}) {
  const [confirmDiscardOpen, setConfirmDiscardOpen] = React.useState(false);

  const form = useForm({
    defaultValues: { body: initialBody },
    onSubmit: ({ value }) => {
      const trimmed = value.body.trim();
      if (!trimmed) {
        toast.info("Comment required", {
          description: "Please add a comment before saving.",
        });
        return;
      }
      onSave(trimmed);
    },
  });

  const requestCancel = React.useCallback(() => {
    if (form.state.values.body.trim() === initialBody.trim()) {
      onCancel();
    } else {
      setConfirmDiscardOpen(true);
    }
  }, [form, initialBody, onCancel]);

  const focusAtEnd = React.useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-2"
    >
      <form.Field
        name="body"
        children={(field) => (
          <Textarea
            ref={focusAtEnd}
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void form.handleSubmit();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                requestCancel();
              }
            }}
            className="min-h-0 p-0 text-sm leading-relaxed whitespace-pre-wrap shadow-none focus-visible:ring-0"
            rows={1}
          />
        )}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="xs" onClick={requestCancel}>
          Cancel
        </Button>
        <Button type="submit" size="xs" variant="outline">
          Save
        </Button>
      </div>
      <AlertDialog
        open={confirmDiscardOpen}
        onOpenChange={setConfirmDiscardOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that you want to discard your changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onCancel}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

export function CommentCard({
  comment,
  author,
  nested = false,
  className,
  replies,
  currentUserId,
  authorLabel,
  onResolve,
  onUnresolve,
  onDelete,
  onEditBody,
  threadResolved,
  isEditing,
  onEditingChange,
  editDisabled = false,
  muted = false,
  reactions = [],
  onToggleReaction,
}: {
  comment: PowerSyncIssueComment;
  author: PowerSyncMemberOption | undefined;
  nested?: boolean;
  className?: string;
  /** Only needed on the root comment, for "Copy thread as Markdown". */
  replies?: PowerSyncIssueComment[];
  currentUserId: string;
  authorLabel: (userId: string) => string;
  onResolve: () => void;
  onUnresolve: () => void;
  onDelete: () => void;
  onEditBody: (body: string) => void;
  /** This comment's own reactions. */
  reactions?: PowerSyncCommentReaction[];
  onToggleReaction: (emoji: string) => void;
  /** Root only — whether ANY comment in the thread (root or a reply) holds
   * the resolution, so the menu offers "Reopen thread" even when a reply
   * (not this root) is the one actually resolved. */
  threadResolved?: boolean;
  /** Whether THIS comment is the one currently switched into edit mode —
   * controlled by the thread, since only one comment can be edited at once. */
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
  /** True when a DIFFERENT comment in this thread is currently being
   * edited — Linear hides "Edit" everywhere else while one is in progress. */
  editDisabled?: boolean;
  /** Dims and disables interaction on this comment while a different
   * comment elsewhere in the same thread is being edited. */
  muted?: boolean;
}) {
  const isRoot = !nested;
  const resolved = isRoot
    ? (threadResolved ?? false)
    : Boolean(comment.resolvedAt);
  const isOwnComment = comment.userId === currentUserId;
  const edited = comment.updatedAt !== comment.createdAt;

  const menuProps = {
    comment,
    replies,
    canDelete: isOwnComment,
    canEdit: isOwnComment && !editDisabled,
    isRoot,
    resolved,
    authorLabel,
    onResolve,
    onUnresolve,
    onDelete,
    onEdit: () => onEditingChange(true),
  };

  const cardContent = (
    <div
      id={`comment-${comment.id}`}
      className={cn(
        "bg-card group/comment relative flex flex-col gap-2 p-4",
        muted && "pointer-events-none",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <UserAvatar
          avatarUrl={author?.avatarUrl}
          label={author?.label}
          email={author?.email}
          className="size-5!"
          fallbackClassName="text-[9px]"
        />
        {author ? (
          <UserHoverCard user={author}>
            <span className="hover:text-foreground text-sm font-medium transition-colors">
              {author.label}
            </span>
          </UserHoverCard>
        ) : (
          <span className="text-sm font-medium">Someone</span>
        )}
        <span className="text-muted-foreground text-xs">
          {formatCommentTime(comment.createdAt)}
          {edited && " (edited)"}
        </span>
        {!isRoot && resolved && (
          <span className="shrink-0 text-xs font-medium text-green-500">
            Resolution
          </span>
        )}
        {!isEditing && (
          <div className="ml-auto opacity-0 transition-opacity group-hover/comment:opacity-100 has-[[data-popup-open]]:opacity-100">
            <CommentMenu {...menuProps} onReact={onToggleReaction} />
          </div>
        )}
      </div>
      {isEditing ? (
        <div className={cn(nested && "pl-7")}>
          <CommentEditForm
            initialBody={comment.body}
            onSave={(body) => {
              onEditBody(body);
              onEditingChange(false);
            }}
            onCancel={() => onEditingChange(false)}
          />
        </div>
      ) : (
        <React.Fragment>
          <p
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap",
              nested && "pl-7"
            )}
          >
            {comment.body}
          </p>
          <CommentReactions
            reactions={reactions}
            currentUserId={currentUserId}
            authorLabel={authorLabel}
            onToggle={onToggleReaction}
            onReact={onToggleReaction}
            className={cn(nested && "pl-7")}
          />
        </React.Fragment>
      )}
      <div
        className={cn(
          "bg-card/50 absolute inset-0 transition-opacity",
          muted ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
    </div>
  );

  if (muted || isEditing) return cardContent;

  return <CommentContextMenu {...menuProps}>{cardContent}</CommentContextMenu>;
}
