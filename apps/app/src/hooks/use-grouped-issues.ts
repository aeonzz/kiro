import * as React from "react";
import { getWorkflowIcon, workflowGroupLabels, workflowGroupOrder } from "@/config";
import type { WorkflowType } from "@kiro/db";
import { User02Icon } from "@hugeicons/core-free-icons";

import type { IconType } from "@/types/inbox";
import type { Issue } from "@/types/issue";
import { issueFilterOptions } from "@/config/team";
import type {
  PowerSyncLabelOption,
  PowerSyncMemberOption,
} from "@/lib/collections/team-metadata-powersync";
import type { IssueDisplayConfig } from "./use-issue-display-store";

export type IssueGroup = {
  id: string;
  label: string;
  icon?: IconType | string;
  color: string;
  issues: Issue[];
};

// The app-wide stand-ins for "this issue has no value on that dimension".
// Grouping uses them as group ids, option counts as bucket keys, and the route
// field maps project onto them so a filter can select the empty bucket. Compare
// against these rather than retyping the strings.
export const GROUP_ID_UNASSIGNED = "unassigned";
export const GROUP_ID_NO_PROJECT = "no-project";
export const GROUP_ID_NO_LABEL = "no-label";

const workflowTypeOrder = new Map(
  workflowGroupOrder.map((type, index) => [type, index])
);

const priorityOrder: Record<string, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  NO_PRIORITY: 0,
};

interface UseGroupedIssuesOptions {
  issues: Issue[];
  config: Pick<
    IssueDisplayConfig,
    | "grouping"
    | "ordering"
    | "direction"
    | "completedIssues"
    | "showEmptyGroups"
    | "showSubIssues"
  >;
  groupByStatusType?: boolean;
  workflowStates: Array<{
    id: string;
    name: string;
    type: string;
    color?: string;
    position: number;
  }>;
  orgMembers: PowerSyncMemberOption[];
  teamProjects: Array<{ value: string; label: string; color?: string }>;
  teamLabels: PowerSyncLabelOption[];
}

export function useGroupedIssues({
  issues,
  config,
  groupByStatusType = false,
  workflowStates,
  orgMembers,
  teamProjects,
  teamLabels,
}: UseGroupedIssuesOptions): {
  groupedIssues: IssueGroup[];
  flattenedIssues: Issue[];
} {
  const {
    grouping,
    ordering,
    direction,
    completedIssues,
    showEmptyGroups,
    showSubIssues,
  } = config;

  return React.useMemo(() => {
    const completedTypes = new Set(["COMPLETED"]);

    const now = Date.now();
    const completedCutoff: number | null =
      completedIssues === "none"
        ? -Infinity
        : completedIssues === "past-day"
          ? now - 86_400_000
          : completedIssues === "past-week"
            ? now - 7 * 86_400_000
            : completedIssues === "past-month"
              ? now - 30 * 86_400_000
              : null;

    const visibleIssues = issues.filter((issue) => {
      if (!showSubIssues && issue.parentId) return false;
      const state = workflowStates.find(
        (s) => s.id === (issue.stateId ?? issue.status)
      );
      const isCompleted = state
        ? completedTypes.has(state.type)
        : completedTypes.has(issue.status);
      if (!isCompleted) return true;
      if (completedCutoff === -Infinity) return false;
      if (completedCutoff === null) return true;
      return new Date(issue.updatedAt).getTime() >= completedCutoff;
    });

    const sortIssues = (list: Issue[]): Issue[] => {
      if (!ordering || ordering === "manual") {
        const withPos = list
          .filter((i) => i.position !== undefined)
          .sort((a, b) => a.position! - b.position!);
        const withoutPos = list
          .filter((i) => i.position === undefined)
          .sort((a, b) => (b.number ?? 0) - (a.number ?? 0));
        return [...withoutPos, ...withPos];
      }
      const dir = direction === "asc" ? 1 : -1;
      const byPosition = (a: Issue, b: Issue) =>
        (a.position ?? Infinity) - (b.position ?? Infinity);
      return [...list].sort((a, b) => {
        let primary = 0;
        switch (ordering) {
          case "title":
            primary = dir * a.title.localeCompare(b.title);
            break;
          case "priority":
            primary =
              dir *
              ((priorityOrder[a.priority] ?? 99) -
                (priorityOrder[b.priority] ?? 99));
            break;
          case "status": {
            const stateA = workflowStates.find(
              (s) => s.id === (a.stateId ?? a.status)
            );
            const stateB = workflowStates.find(
              (s) => s.id === (b.stateId ?? b.status)
            );
            const orderA = stateA
              ? (workflowTypeOrder.get(stateA.type as WorkflowType) ?? 99) * 1000 +
                stateA.position
              : 99999;
            const orderB = stateB
              ? (workflowTypeOrder.get(stateB.type as WorkflowType) ?? 99) * 1000 +
                stateB.position
              : 99999;
            primary = dir * (orderA - orderB);
            // Secondary: priority descending (urgent first) when status is tied
            if (primary === 0) {
              primary =
                (priorityOrder[b.priority] ?? 0) -
                (priorityOrder[a.priority] ?? 0);
            }
            break;
          }
          case "assignee": {
            const nameA =
              orgMembers.find((m) => m.value === a.assigneeId)?.label ?? "￿";
            const nameB =
              orgMembers.find((m) => m.value === b.assigneeId)?.label ?? "￿";
            primary = dir * nameA.localeCompare(nameB);
            break;
          }
          case "updated":
            primary =
              dir *
              (new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime());
            break;
          case "created":
            primary =
              dir *
              (new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime());
            break;
        }
        return primary !== 0 ? primary : byPosition(a, b);
      });
    };

    if (!grouping || grouping === "none") {
      const sorted = sortIssues(visibleIssues);
      return {
        groupedIssues: [
          {
            id: "none",
            label: "All issues",
            issues: sorted,
            color: "var(--muted)",
          },
        ],
        flattenedIssues: sorted,
      };
    }

    const groups: Record<
      string,
      {
        label: string;
        icon?: IconType | string;
        color: string;
        issues: Issue[];
      }
    > = {};

    if (grouping === "status" && groupByStatusType) {
      workflowGroupOrder.forEach((type) => {
        const hasStates = workflowStates.some((s) => s.type === type);
        if (!hasStates) return;
        groups[type] = {
          label: workflowGroupLabels[type],
          icon: getWorkflowIcon(type),
          color:
            workflowStates.find((s) => s.type === type)?.color ??
            "var(--muted-foreground)",
          issues: [],
        };
      });
      visibleIssues.forEach((issue) => {
        const state = workflowStates.find((s) => s.id === issue.stateId);
        const key = state?.type ?? issue.status;
        if (groups[key]) groups[key].issues.push(issue);
      });
    } else if (grouping === "status") {
      const orderedStates = [...workflowStates].sort(
        (a, b) =>
          (workflowTypeOrder.get(a.type as WorkflowType) ?? Number.MAX_SAFE_INTEGER) -
            (workflowTypeOrder.get(b.type as WorkflowType) ?? Number.MAX_SAFE_INTEGER) ||
          a.position - b.position
      );
      orderedStates.forEach((state) => {
        groups[state.id] = {
          label: state.name,
          icon: getWorkflowIcon(state.type as WorkflowType),
          color: state.color || "var(--muted-foreground)",
          issues: [],
        };
      });
      visibleIssues.forEach((issue) => {
        const key = issue.stateId ?? issue.status;
        if (groups[key]) groups[key].issues.push(issue);
      });
    } else if (grouping === "priority") {
      const priorityOptions =
        issueFilterOptions.find((o) => o.id === "priority")?.options ?? [];
      const orderedPriorityValues = ["URGENT", "HIGH", "MEDIUM", "LOW", "NO_PRIORITY"];
      const sortedOptions = [...priorityOptions].sort(
        (a, b) => orderedPriorityValues.indexOf(a.value) - orderedPriorityValues.indexOf(b.value)
      );
      sortedOptions.forEach((opt) => {
        groups[opt.value] = {
          label: opt.label,
          icon: opt.icon,
          color: "var(--muted-foreground)",
          issues: [],
        };
      });
      visibleIssues.forEach((issue) => {
        if (groups[issue.priority]) groups[issue.priority].issues.push(issue);
      });
    } else if (grouping === "assignee") {
      groups[GROUP_ID_UNASSIGNED] = {
        label: "No assignee",
        icon: User02Icon,
        color: "var(--muted-foreground)",
        issues: [],
      };
      orgMembers.forEach((member) => {
        groups[member.value] = {
          label: member.label,
          icon: member.avatarUrl,
          color: "var(--muted-foreground)",
          issues: [],
        };
      });
      visibleIssues.forEach((issue) => {
        const id = issue.assigneeId || GROUP_ID_UNASSIGNED;
        if (groups[id]) groups[id].issues.push(issue);
      });
    } else if (grouping === "project") {
      groups[GROUP_ID_NO_PROJECT] = {
        label: "No project",
        color: "var(--muted-foreground)",
        issues: [],
      };
      teamProjects.forEach((project) => {
        groups[project.value] = {
          label: project.label,
          color: project.color ?? "var(--muted-foreground)",
          issues: [],
        };
      });
      visibleIssues.forEach((issue) => {
        const id = issue.projectId || GROUP_ID_NO_PROJECT;
        if (groups[id]) groups[id].issues.push(issue);
      });
    } else if (grouping === "label") {
      groups[GROUP_ID_NO_LABEL] = {
        label: "No label",
        color: "var(--muted-foreground)",
        issues: [],
      };
      teamLabels.forEach((label) => {
        groups[label.value] = {
          label: label.label,
          color: label.color ?? "var(--muted-foreground)",
          issues: [],
        };
      });
      visibleIssues.forEach((issue) => {
        if (!issue.labelIds || issue.labelIds.length === 0) {
          groups[GROUP_ID_NO_LABEL].issues.push(issue);
        } else {
          issue.labelIds.forEach((labelId) => {
            if (groups[labelId]) groups[labelId].issues.push(issue);
          });
        }
      });
    }

    const filteredGroups = Object.entries(groups)
      .filter(([_, group]) => showEmptyGroups || group.issues.length > 0)
      .map(([id, group]) => ({
        id,
        ...group,
        issues: sortIssues(group.issues),
      }));

    return {
      groupedIssues: filteredGroups,
      flattenedIssues: filteredGroups.flatMap((g) => g.issues),
    };
  }, [
    issues,
    grouping,
    ordering,
    direction,
    completedIssues,
    showEmptyGroups,
    showSubIssues,
    groupByStatusType,
    workflowStates,
    orgMembers,
    teamProjects,
    teamLabels,
  ]);
}
