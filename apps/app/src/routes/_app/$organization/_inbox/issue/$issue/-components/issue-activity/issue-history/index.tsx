import * as React from "react";

import { usePowerSyncIssueHistory } from "@/lib/collections/issue-history-powersync";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  usePowerSyncWorkflowStates,
} from "@/lib/collections/team-metadata-powersync";
import { Separator } from "@/components/ui/separator";

import { ActivityCluster } from "./activity-cluster";
import { ActivityRow } from "./activity-row";
import { groupHistoryEvents } from "./group-history-events";
import { groupIntoFeedItems } from "./group-into-feed-items";
import type { LookupContext } from "./types";

export function IssueHistory({
  issueId,
  teamId,
  organization,
}: {
  issueId: string;
  teamId?: string;
  organization: string;
}) {
  const history = usePowerSyncIssueHistory(issueId);

  const members = usePowerSyncOrgMembers(organization);
  const workflowStates = usePowerSyncWorkflowStates(teamId);
  const projects = usePowerSyncTeamProjects(teamId);
  const labels = usePowerSyncTeamLabels(teamId);

  const memberById = React.useMemo(
    () => new Map(members.map((member) => [member.value, member])),
    [members]
  );
  const stateById = React.useMemo(
    () => new Map(workflowStates.map((state) => [state.id, state])),
    [workflowStates]
  );
  const projectById = React.useMemo(
    () => new Map(projects.map((project) => [project.value, project])),
    [projects]
  );
  const labelById = React.useMemo(
    () => new Map(labels.map((label) => [label.value, label])),
    [labels]
  );

  const events = React.useMemo(() => groupHistoryEvents(history), [history]);
  const feedItems = React.useMemo(() => groupIntoFeedItems(events), [events]);
  const ctx = React.useMemo<LookupContext>(
    () => ({ stateById, memberById, projectById, labelById }),
    [stateById, memberById, projectById, labelById]
  );

  if (feedItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 px-7">
      <Separator />
      <h3 className="text-sm font-semibold">Activity</h3>
      <ul className="flex flex-col gap-3 px-3">
        {feedItems.map((item) =>
          item.type === "cluster" ? (
            <li key={item.events[item.events.length - 1].id}>
              <ActivityCluster cluster={item} ctx={ctx} />
            </li>
          ) : (
            <li key={item.event.id}>
              <ActivityRow event={item.event} ctx={ctx} />
            </li>
          )
        )}
      </ul>
    </div>
  );
}
