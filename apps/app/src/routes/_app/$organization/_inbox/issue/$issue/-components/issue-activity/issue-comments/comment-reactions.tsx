import * as React from "react";
import { SmilePlusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { PowerSyncCommentReaction } from "@/lib/collections/issue-comment-reactions-powersync";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CommentReactionPicker({
  onReact,
}: {
  onReact: (emoji: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghostPopup"
        size="icon-xs"
        tooltip="Add reaction"
        render={(triggerProps) => <PopoverTrigger {...triggerProps} />}
      >
        <HugeiconsIcon icon={SmilePlusIcon} className="size-4" />
      </Button>
      <PopoverContent flush align="end" className="w-fit overflow-hidden">
        <EmojiPicker
          className="h-85"
          onEmojiSelect={({ emoji }) => {
            onReact(emoji);
            setOpen(false);
          }}
        >
          <EmojiPickerSearch placeholder="Search emojis..." />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}

type ReactionGroup = {
  emoji: string;
  count: number;
  reactedByMe: boolean;
  /** Reactor user ids in the order they reacted, current user excluded. */
  otherUserIds: string[];
};

function groupReactions(
  reactions: PowerSyncCommentReaction[],
  currentUserId: string
): ReactionGroup[] {
  const order: string[] = [];
  const byEmoji = new Map<string, ReactionGroup>();

  for (const reaction of reactions) {
    let group = byEmoji.get(reaction.emoji);
    if (!group) {
      group = { emoji: reaction.emoji, count: 0, reactedByMe: false, otherUserIds: [] };
      byEmoji.set(reaction.emoji, group);
      order.push(reaction.emoji);
    }
    group.count += 1;
    if (reaction.userId === currentUserId) {
      group.reactedByMe = true;
    } else {
      group.otherUserIds.push(reaction.userId);
    }
  }

  return order.map((emoji) => byEmoji.get(emoji)!);
}

/** Joins reactor names with commas and a trailing "and", e.g.
 * "You", "You and Alice", "You, Alice and Bob". */
function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** "You reacted with 🐪" / "You and Alice reacted with 🐪" /
 * "You, Alice and 3 others reacted with 🐪". */
function reactionTooltip(
  group: ReactionGroup,
  authorLabel: (userId: string) => string
) {
  const MAX_NAMES = 3;
  const names = group.reactedByMe ? ["You"] : [];
  names.push(...group.otherUserIds.map(authorLabel));

  let label: string;
  if (names.length <= MAX_NAMES) {
    label = joinNames(names);
  } else {
    const shown = names.slice(0, MAX_NAMES);
    const remaining = names.length - MAX_NAMES;
    label = `${shown.join(", ")} and ${remaining} ${
      remaining === 1 ? "other" : "others"
    }`;
  }

  return `${label} reacted with ${group.emoji}`;
}

export function CommentReactions({
  reactions,
  currentUserId,
  authorLabel,
  onToggle,
  onReact,
  className,
}: {
  reactions: PowerSyncCommentReaction[];
  currentUserId: string;
  authorLabel: (userId: string) => string;
  onToggle: (emoji: string) => void;
  /** When provided, an inline "add reaction" picker is shown after the
   * existing reaction chips. */
  onReact?: (emoji: string) => void;
  className?: string;
}) {
  const groups = groupReactions(reactions, currentUserId);
  if (groups.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {groups.map((group) => (
        <Tooltip key={group.emoji}>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => onToggle(group.emoji)}
                className={cn(
                  "shadow-border-sm flex h-6 items-center gap-1 rounded-full px-2 text-xs transition-colors",
                  group.reactedByMe
                    ? "bg-brand/10 text-foreground"
                    : "bg-card text-muted-foreground hover:bg-accent"
                )}
              />
            }
          >
            <span>{group.emoji}</span>
            <span className="tabular-nums">{group.count}</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 text-center">
            {reactionTooltip(group, authorLabel)}
          </TooltipContent>
        </Tooltip>
      ))}
      {onReact && <CommentReactionPicker onReact={onReact} />}
    </div>
  );
}
