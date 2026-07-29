import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import {
  useCreateIssueStore,
  type CreateIssueTriggerContext,
} from "@/hooks/use-create-issue-store";
import {
  GROUP_ID_NO_PROJECT,
  GROUP_ID_UNASSIGNED,
} from "@/hooks/use-grouped-issues";
import { Button } from "@/components/ui/button";
import { createIssueDialogHandle } from "@/components/create-issue-dialog";

// Maps the grouped dimension onto the create form's matching field, so a group's
// own value becomes the new issue's default. Groupings absent here get the team
// only: "label" because labels aren't persisted on create yet, "none"/"parent"
// because they have nothing the form can carry over.
export function getGroupTriggerContext(
  grouping: string,
  groupId: string,
  teamId?: string
): CreateIssueTriggerContext {
  switch (grouping) {
    case "status":
      return { teamId, status: groupId };
    case "priority":
      return { teamId, priority: groupId };
    case "assignee":
      return {
        teamId,
        assigneeId: groupId === GROUP_ID_UNASSIGNED ? null : groupId,
      };
    case "project":
      return {
        teamId,
        projectId: groupId === GROUP_ID_NO_PROJECT ? null : groupId,
      };
    default:
      return { teamId };
  }
}

export function GroupCreateIssueButton({
  grouping,
  groupId,
  teamId,
  className,
}: {
  grouping: string;
  groupId: string;
  teamId?: string;
  className?: string;
}) {
  const setTriggerContext = useCreateIssueStore(
    (state) => state.setTriggerContext
  );

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className={cn("[&_svg:not([class*='size-'])]:size-3.5", className)}
      tooltip={{ content: "Create issue" }}
      onClick={(event) => {
        // The list header sits inside a collapsible trigger — don't toggle it.
        event.stopPropagation();
        // Set the context before opening: the dialog reads it synchronously in
        // its onOpenChange handler.
        setTriggerContext(getGroupTriggerContext(grouping, groupId, teamId));
        createIssueDialogHandle.open(null);
      }}
    >
      <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
      <span className="sr-only">Create issue in {grouping} group</span>
    </Button>
  );
}
