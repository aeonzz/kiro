import * as React from "react";
import { getWorkflowIcon, workflowGroupOrder } from "@/config";
import { User02Icon } from "@hugeicons/core-free-icons";

import { IssuePriority } from "@/types/enums";
import { issueFilterOptions } from "@/config/team";
import type { PowerSyncIssueDetail } from "@/lib/collections/issues-powersync";
import {
  usePowerSyncOrgMembers,
  usePowerSyncWorkflowStates,
} from "@/lib/collections/team-metadata-powersync";

import { PropertyCombobox, PropertySection } from "./property-controls";

const UNASSIGNED = "unassigned";

const workflowTypeOrder = new Map(
  workflowGroupOrder.map((type, index) => [type, index])
);

export function PropertiesGroup({
  issue,
  organization,
  onUpdate,
}: {
  issue: PowerSyncIssueDetail;
  organization: string;
  onUpdate: (changes: Record<string, unknown>) => void;
}) {
  const workflowStates = usePowerSyncWorkflowStates(issue.teamId);
  const orgMembers = usePowerSyncOrgMembers(organization);

  const statusOptions = React.useMemo(
    () =>
      [...workflowStates]
        .sort(
          (a, b) =>
            (workflowTypeOrder.get(a.type) ?? Number.MAX_SAFE_INTEGER) -
              (workflowTypeOrder.get(b.type) ?? Number.MAX_SAFE_INTEGER) ||
            a.position - b.position
        )
        .map((state) => ({
          value: state.id,
          label: state.name,
          icon: getWorkflowIcon(state.type),
          color: state.color,
        })),
    [workflowStates]
  );

  const priorityOptions =
    issueFilterOptions.find((option) => option.id === "priority")?.options ?? [];

  const assigneeOptions = React.useMemo(
    () => [
      {
        value: UNASSIGNED,
        label: "No assignee",
        icon: User02Icon,
      },
      ...orgMembers.map((member) => ({
        value: member.value,
        label: member.label,
        avatarUrl: member.avatarUrl,
      })),
    ],
    [orgMembers]
  );

  return (
    <PropertySection title="Properties">
      <PropertyCombobox
        items={statusOptions}
        value={statusOptions.find((option) => option.value === issue.stateId)}
        onValueChange={(value) => {
          if (value) onUpdate({ stateId: value.value });
        }}
        emptyLabel="Set status"
        searchPlaceholder="Set status to..."
        tooltip="Set status"
        kbd="S"
      />
      <PropertyCombobox
        items={priorityOptions}
        value={priorityOptions.find(
          (option) => option.value === issue.priority
        )}
        onValueChange={(value) => {
          if (value) onUpdate({ priority: value.value as IssuePriority });
        }}
        emptyLabel="Set priority"
        isEmpty={issue.priority === IssuePriority.NO_PRIORITY}
        searchPlaceholder="Set priority to..."
        tooltip="Set priority"
        kbd="P"
      />
      <PropertyCombobox
        items={assigneeOptions}
        value={
          assigneeOptions.find(
            (option) => option.value === (issue.assigneeId ?? UNASSIGNED)
          ) ?? assigneeOptions[0]
        }
        onValueChange={(value) => {
          if (!value) return;
          onUpdate({
            assigneeId: value.value === UNASSIGNED ? null : value.value,
          });
        }}
        emptyLabel="Assign"
        isEmpty={!issue.assigneeId}
        searchPlaceholder="Assign to..."
        tooltip="Assign to"
        kbd="A"
      />
    </PropertySection>
  );
}
