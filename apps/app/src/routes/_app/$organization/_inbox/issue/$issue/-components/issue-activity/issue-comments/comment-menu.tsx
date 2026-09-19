import * as React from "react";
import {
  ClipboardIcon,
  Delete02Icon,
  GitForkIcon,
  Link01Icon,
  MoreHorizontalIcon,
  NotificationOffIcon,
  PencilEdit02Icon,
  Task01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import type { PowerSyncIssueComment } from "@/lib/collections/issue-comments-powersync";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CommentReactionPicker } from "./comment-reactions";

function copyToClipboard(text: string, successMessage: string) {
  void navigator.clipboard.writeText(text).then(
    () => toast.info(successMessage),
    () => toast.error("Couldn't copy to clipboard")
  );
}

function threadToMarkdown(
  root: PowerSyncIssueComment,
  replies: PowerSyncIssueComment[],
  authorLabel: (userId: string) => string
) {
  const lines = [`**${authorLabel(root.userId)}**\n${root.body}`];
  for (const reply of replies) {
    lines.push(`**${authorLabel(reply.userId)}**\n${reply.body}`);
  }
  return lines.join("\n\n");
}

type MenuAction =
  | {
      kind: "item";
      key: string;
      icon: typeof MoreHorizontalIcon;
      label: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      variant?: "default" | "destructive";
    }
  | { kind: "separator"; key: string };

export type CommentMenuProps = {
  comment: PowerSyncIssueComment;
  /** Only needed for "Copy thread as Markdown" on the root comment. */
  replies?: PowerSyncIssueComment[];
  canDelete: boolean;
  /** Author-only, and only meaningful when this menu is attached to an
   * actual comment (not the collapsed-thread trigger, which has nothing to
   * switch into edit mode). */
  canEdit: boolean;
  isRoot: boolean;
  resolved: boolean;
  authorLabel: (userId: string) => string;
  onResolve: () => void;
  onUnresolve: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

function buildMenuActions({
  comment,
  replies = [],
  canDelete,
  canEdit,
  isRoot,
  resolved,
  authorLabel,
  onResolve,
  onUnresolve,
  onDelete,
  onEdit,
}: CommentMenuProps): MenuAction[] {
  return [
    ...(canEdit
      ? ([
          {
            kind: "item",
            key: "edit",
            icon: PencilEdit02Icon,
            label: "Edit",
            onClick: onEdit,
          },
        ] as const)
      : []),
    {
      kind: "item",
      key: "unsubscribe",
      icon: NotificationOffIcon,
      label: "Unsubscribe from thread",
      disabled: true,
    },
    { kind: "separator", key: "sep-1" },
    {
      kind: "item",
      key: "resolve",
      icon: Tick02Icon,
      label: isRoot
        ? resolved
          ? "Reopen thread"
          : "Resolve thread"
        : resolved
          ? "Reopen thread"
          : "Resolve thread with comment",
      onClick: () => (resolved ? onUnresolve() : onResolve()),
    },
    { kind: "separator", key: "sep-2" },
    {
      kind: "item",
      key: "copy-link",
      icon: Link01Icon,
      label: "Copy link to comment",
      onClick: () =>
        copyToClipboard(
          `${window.location.href.split("#")[0]}#comment-${comment.id}`,
          "Comment URL copied to clipboard"
        ),
    },
    ...(isRoot
      ? ([
          {
            kind: "item",
            key: "copy-markdown",
            icon: ClipboardIcon,
            label: "Copy thread as Markdown",
            onClick: () =>
              copyToClipboard(
                threadToMarkdown(comment, replies, authorLabel),
                "Thread copied as Markdown"
              ),
          },
        ] as const)
      : ([
          {
            kind: "item",
            key: "copy-markdown",
            icon: ClipboardIcon,
            label: "Copy content as Markdown",
            onClick: () =>
              copyToClipboard(comment.body, "Comment copied as Markdown"),
          },
        ] as const)),
    { kind: "separator", key: "sep-3" },
    {
      kind: "item",
      key: "new-issue",
      icon: Task01Icon,
      label: "New issue from comment...",
      disabled: true,
    },
    {
      kind: "item",
      key: "new-sub-issue",
      icon: GitForkIcon,
      label: "New sub-issue from comment...",
      disabled: true,
    },
    { kind: "separator", key: "sep-4" },
    {
      kind: "item",
      key: "delete",
      icon: Delete02Icon,
      label: "Delete",
      variant: "destructive",
      disabled: !canDelete,
      onClick: onDelete,
    },
  ];
}

function useDeleteConfirmation(onDelete: () => void, hasReplies: boolean) {
  const [open, setOpen] = React.useState(false);

  const dialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
          <AlertDialogDescription>
            {hasReplies &&
              "All replies to the comment will be deleted as well. "}
            You cannot undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { requestDelete: () => setOpen(true), dialog };
}

export function CommentMenu(
  props: CommentMenuProps & { onReact: (emoji: string) => void }
) {
  const hasReplies = props.isRoot && (props.replies?.length ?? 0) > 0;
  const { requestDelete, dialog } = useDeleteConfirmation(
    props.onDelete,
    hasReplies
  );
  const actions = buildMenuActions({ ...props, onDelete: requestDelete });

  return (
    <React.Fragment>
      <div className="flex shrink-0 items-center gap-1">
        <CommentReactionPicker onReact={props.onReact} />
        <DropdownMenu>
          <Button
            variant="ghostPopup"
            size="icon-xs"
            tooltip="Comment options"
            render={(triggerProps) => <DropdownMenuTrigger {...triggerProps} />}
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
          </Button>
          <DropdownMenuContent align="end" className="w-64">
            {actions.map((action) =>
              action.kind === "separator" ? (
                <DropdownMenuSeparator key={action.key} />
              ) : (
                <DropdownMenuItem
                  key={action.key}
                  variant={action.variant}
                  disabled={action.disabled}
                  onClick={action.onClick}
                >
                  <HugeiconsIcon icon={action.icon} />
                  {action.label}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {dialog}
    </React.Fragment>
  );
}

export function CommentContextMenu({
  children,
  ...menuProps
}: CommentMenuProps & { children: React.ReactNode }) {
  const hasReplies = menuProps.isRoot && (menuProps.replies?.length ?? 0) > 0;
  const { requestDelete, dialog } = useDeleteConfirmation(
    menuProps.onDelete,
    hasReplies
  );
  const actions = buildMenuActions({ ...menuProps, onDelete: requestDelete });

  return (
    <React.Fragment>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {actions.map((action) =>
            action.kind === "separator" ? (
              <ContextMenuSeparator key={action.key} />
            ) : (
              <ContextMenuItem
                key={action.key}
                variant={action.variant}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                <HugeiconsIcon icon={action.icon} />
                {action.label}
              </ContextMenuItem>
            )
          )}
        </ContextMenuContent>
      </ContextMenu>
      {dialog}
    </React.Fragment>
  );
}
