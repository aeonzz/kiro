import { getWorkflowIcon } from "@/config";
import { Icon } from "@/utils/icon";
import { Pen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { IssuePriority } from "@/types/enums";
import { issuePriorityMap } from "@/config/inbox";
import type {
  PowerSyncMemberOption,
  PowerSyncWorkflowState,
} from "@/lib/collections/team-metadata-powersync";
import { UserAvatar } from "@/components/user-avatar";

import type { HistoryEvent } from "./types";

export function ActivityIcon({
  event,
  actor,
  stateById,
}: {
  event: HistoryEvent;
  actor: PowerSyncMemberOption | undefined;
  stateById: Map<string, PowerSyncWorkflowState>;
}) {
  const singleField = event.changes.length === 1 ? event.changes[0] : null;

  if (singleField?.field === "title") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center">
        <HugeiconsIcon
          icon={Pen01Icon}
          strokeWidth={2}
          className="text-muted-foreground size-4"
        />
      </span>
    );
  }

  if (singleField?.field === "priority") {
    const priority = (singleField.newValue ?? "NO_PRIORITY") as IssuePriority;
    const meta = issuePriorityMap[priority] ?? issuePriorityMap.NO_PRIORITY;
    return (
      <span className="flex size-5 shrink-0 items-center justify-center">
        <Icon icon={meta.icon} className="size-4" />
      </span>
    );
  }

  if (singleField?.field === "stateId") {
    const state = singleField.newValue
      ? stateById.get(singleField.newValue)
      : undefined;
    return (
      <span className="flex size-5 shrink-0 items-center justify-center">
        <Icon
          icon={getWorkflowIcon(state?.type ?? "BACKLOG")}
          color={state?.color}
        />
      </span>
    );
  }

  return (
    <UserAvatar
      avatarUrl={actor?.avatarUrl}
      label={actor?.label}
      email={actor?.email}
      className="size-5!"
      fallbackClassName="text-[9px]"
    />
  );
}
