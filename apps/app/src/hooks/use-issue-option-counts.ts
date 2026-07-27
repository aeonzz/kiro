import * as React from "react";
import { useLiveQuery } from "@tanstack/react-db";

import { getIssueLabelLinksCollection } from "@/lib/collections/issue-label-links-powersync";
import { getIssuesPowerSyncCollection } from "@/lib/collections/issues-powersync";
import { usePowerSyncWorkflowStates } from "@/lib/collections/team-metadata-powersync";
import { getDateBuckets } from "@/lib/filter";

import { GROUP_ID_NO_PROJECT, GROUP_ID_UNASSIGNED } from "./use-grouped-issues";
import { issueTabIncludes, useIssueTab } from "./use-issue-tab-key";

export type IssueOptionCounts = Record<string, Record<string, number>>;

/**
 * How many issues sit under each option of every filterable dimension, keyed by
 * filter id then option value.
 *
 * Counted over the issues the current tab lists — Backlog reports backlog
 * totals, not team-wide ones — but ignoring the active filters, so a value's
 * count doesn't shift as you narrow down. It answers "how many are there here",
 * not "how many would be left".
 */
export function useIssueOptionCounts(teamId?: string): IssueOptionCounts {
  const tab = useIssueTab();
  const workflowStates = usePowerSyncWorkflowStates(teamId);
  const issueCollection = React.useMemo(
    () => getIssuesPowerSyncCollection(),
    []
  );
  const linkCollection = React.useMemo(
    () => getIssueLabelLinksCollection(),
    []
  );

  const { data: rows = [] } = useLiveQuery(
    (q) => q.from({ issue: issueCollection }),
    [issueCollection]
  );
  const { data: links = [] } = useLiveQuery(
    (q) => q.from({ link: linkCollection }),
    [linkCollection]
  );

  const statusTypeById = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const state of workflowStates) map.set(state.id, state.type);
    return map;
  }, [workflowStates]);

  // The rows this tab actually lists. stateId resolves the same way
  // powerSyncRowToIssue resolves it, fallback included, so the counts describe
  // the same set of issues the list below them renders.
  const tabRows = React.useMemo(
    () =>
      rows.filter(
        (row) =>
          row.teamId === teamId &&
          issueTabIncludes(
            tab,
            statusTypeById.get(row.stateId as string) ?? "BACKLOG"
          )
      ),
    [rows, teamId, tab, statusTypeById]
  );

  const tabIssueIds = React.useMemo(() => {
    const ids = new Set<string>();
    for (const row of tabRows) if (row.id) ids.add(row.id as string);
    return ids;
  }, [tabRows]);

  return React.useMemo(() => {
    const byState: Record<string, number> = {};
    const byLabel: Record<string, number> = {};
    const byAssignee: Record<string, number> = {};
    const byCreator: Record<string, number> = {};
    const byProject: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byCreatedDate: Record<string, number> = {};
    const byUpdatedDate: Record<string, number> = {};

    for (const row of tabRows) {
      const stateId = row.stateId as string;
      if (stateId) byState[stateId] = (byState[stateId] ?? 0) + 1;
      const assigneeId =
        (row.assigneeId as string | undefined) ?? GROUP_ID_UNASSIGNED;
      byAssignee[assigneeId] = (byAssignee[assigneeId] ?? 0) + 1;
      const creatorId = row.creatorId as string | undefined;
      if (creatorId) byCreator[creatorId] = (byCreator[creatorId] ?? 0) + 1;
      const projectId =
        (row.projectId as string | undefined) ?? GROUP_ID_NO_PROJECT;
      byProject[projectId] = (byProject[projectId] ?? 0) + 1;
      const priority = row.priority as string;
      if (priority) byPriority[priority] = (byPriority[priority] ?? 0) + 1;
      for (const bucket of getDateBuckets(row.createdAt as string)) {
        byCreatedDate[bucket] = (byCreatedDate[bucket] ?? 0) + 1;
      }
      for (const bucket of getDateBuckets(row.updatedAt as string)) {
        byUpdatedDate[bucket] = (byUpdatedDate[bucket] ?? 0) + 1;
      }
    }

    for (const link of links) {
      const issueId = link.issueId as string;
      const labelId = link.labelId as string;
      if (!issueId || !labelId || !tabIssueIds.has(issueId)) continue;
      byLabel[labelId] = (byLabel[labelId] ?? 0) + 1;
    }

    return {
      status: byState,
      label: byLabel,
      assignee: byAssignee,
      creator: byCreator,
      project: byProject,
      priority: byPriority,
      "created-date": byCreatedDate,
      "updated-date": byUpdatedDate,
    };
  }, [tabRows, links, tabIssueIds]);
}
