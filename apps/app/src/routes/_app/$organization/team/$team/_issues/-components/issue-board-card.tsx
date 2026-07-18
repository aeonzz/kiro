import * as React from "react";
import { getWorkflowIcon } from "@/config";
import { formatDate } from "@/utils/format-date";
import { Icon } from "@/utils/icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import type { Issue } from "@/types/issue";
import { issueFilterOptions } from "@/config/team";
import { getIssuesPowerSyncCollection } from "@/lib/collections/issues-powersync";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncWorkflowStates,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import { useActiveIssueDisplayOptions } from "@/hooks/use-issue-display-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ItemsCombobox } from "@/components/items-combobox";
import { IssueContextMenu } from "./issue-context-menu";
import { LabelCombobox } from "./label-combobox";

interface IssueBoardCardProps {
  issue: Issue;
  isDragOverlay?: boolean;
}

export function IssueBoardCard({ issue, isDragOverlay }: IssueBoardCardProps) {
  const { organization, team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const { displayProperties } = useActiveIssueDisplayOptions(team);
  const teamId = useTeamId(organization, team);
  const workflowStates = usePowerSyncWorkflowStates(teamId);
  const orgMembers = usePowerSyncOrgMembers(organization);
  const allLabels = usePowerSyncTeamLabels(teamId);
  const issuesCollection = getIssuesPowerSyncCollection();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityOptions =
    issueFilterOptions.find((o) => o.id === "priority")?.options ?? [];

  const statusOptions = React.useMemo(
    () =>
      workflowStates.map((s) => ({
        value: s.id,
        label: s.name,
        icon: getWorkflowIcon(s.type),
        color: s.color,
      })),
    [workflowStates]
  );

  const assigneeOptions = React.useMemo(
    () => [
      {
        value: "unassigned",
        label: "No assignee",
        icon: User02Icon,
        color: "text-muted-foreground",
      },
      ...orgMembers.map((m) => ({
        value: m.value,
        label: m.label,
        avatarUrl: m.avatarUrl,
      })),
    ],
    [orgMembers]
  );

  const issueLabels = React.useMemo(
    () => allLabels.filter((l) => issue.labelIds?.includes(l.value)),
    [allLabels, issue.labelIds]
  );

  const currentState = workflowStates.find((s) => s.id === issue.stateId);
  const currentAssignee = orgMembers.find((m) => m.value === issue.assigneeId);

  const handleUpdateIssue = (changes: Partial<Issue>) => {
    issuesCollection.update(issue.id, (draft) => {
      Object.assign(draft, changes);
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
              "bg-card group flex cursor-default flex-col rounded-lg px-3 py-2 pr-1 shadow-xs",
              isDragging && "opacity-40",
              isDragOverlay && "shadow-lg"
            )}
          />
        }
      >
        <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          {displayProperties.includes("id") && (
            <span className="text-muted-foreground text-xs tabular-nums">
              {issue.number
                ? `${team.toUpperCase()}-${issue.number}`
                : issue.id.slice(0, 6)}
            </span>
          )}

          <div className="flex items-center">
            {displayProperties.includes("status") && (
              <div
                className="-ml-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <ItemsCombobox
                  items={statusOptions}
                  value={statusOptions.find((o) => o.value === issue.stateId)}
                  onValueChange={(v) => {
                    if (v) handleUpdateIssue({ stateId: v.value });
                  }}
                  placeholder="Set status..."
                  kbd="S"
                  isIcon
                  triggerProps={{
                    variant: "ghostText",
                    size: "icon-xs",
                    tooltip: { content: "Set status", kbd: ["S"] },
                  }}
                  contentProps={{ side: "right" }}
                />
              </div>
            )}
            <span className="text-xs-plus text-foreground leading-snug font-medium">
              {issue.title}
            </span>
          </div>
        </div>

        {displayProperties.includes("assignee") && (
          <div
            className="shrink-0"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ItemsCombobox
              items={assigneeOptions}
              value={
                assigneeOptions.find((o) => o.value === issue.assigneeId) ??
                assigneeOptions[0]
              }
              onValueChange={(v) => {
                if (v)
                  handleUpdateIssue({
                    assigneeId:
                      v.value === "unassigned"
                        ? undefined
                        : (v.value as string),
                  });
              }}
              placeholder="Assign to..."
              kbd="A"
              isIcon
              triggerProps={{
                variant: "ghostText",
                size: "icon-xs",
                tooltip: { content: "Assign to", kbd: ["A"] },
              }}
              contentProps={{ side: "bottom" }}
            />
          </div>
        )}
      </div>

      {(displayProperties.includes("priority") ||
        (displayProperties.includes("labels") && issueLabels.length > 0)) && (
        <div className="flex flex-wrap items-center gap-1 my-1">
          {displayProperties.includes("priority") && (
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <ItemsCombobox
                items={priorityOptions}
                value={priorityOptions.find((o) => o.value === issue.priority)}
                onValueChange={(v) => {
                  if (v)
                    handleUpdateIssue({
                      priority: v.value as Issue["priority"],
                    });
                }}
                placeholder="Set priority..."
                kbd="P"
                isIcon
                triggerProps={{
                  variant: "ghostText",
                  size: "icon-xs",
                  tooltip: { content: "Set priority", kbd: ["P"] },
                  className: "p-0! size-auto",
                }}
                contentProps={{ side: "right" }}
              />
            </div>
          )}

          {displayProperties.includes("labels") && issueLabels.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <LabelCombobox
                issueId={issue.id}
                issueLabels={issueLabels}
                allLabelOptions={allLabels}
              />
            </div>
          )}
        </div>
      )}

        {displayProperties.includes("created") && (
          <span className="text-muted-foreground text-xs">
            Created {formatDate(issue.createdAt)}
          </span>
        )}
      </ContextMenuTrigger>
      <IssueContextMenu issue={issue} />
    </ContextMenu>
  );
}
