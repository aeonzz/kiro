import * as React from "react";
import { powerSyncCollectionOptions } from "@tanstack/powersync-db-collection";
import { createCollection, useLiveQuery } from "@tanstack/react-db";

import type { WorkflowGroupType } from "@/config/workflow";
import { getPowerSyncDb } from "@/lib/powersync/db";
import { AppSchema } from "@/lib/powersync/schema";
import { DotIcon } from "@/components/icons";

/**
 * PowerSync-backed collections + hooks for the team metadata the issue list
 * needs (teams, workflow states, labels). Reading these from local SQLite means
 * the list renders from purely-local data — no network dependency while offline.
 *
 * Browser-only: the hooks call into the PowerSync database, so they must only be
 * used inside client-gated components (never during SSR).
 */

function memoizeCollection<T>(factory: () => T) {
  let instance: T | null = null;
  return () => {
    if (typeof window === "undefined") {
      throw new Error("PowerSync collection is only available in the browser");
    }
    if (!instance) {
      instance = factory();
    }
    return instance;
  };
}

const getOrganizationsCollection = memoizeCollection(() =>
  createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.organization,
    })
  )
);

const getTeamsCollection = memoizeCollection(() =>
  createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.team,
    })
  )
);

const getWorkflowStatesCollection = memoizeCollection(() =>
  createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.workflow_state,
    })
  )
);

const getIssueLabelsCollection = memoizeCollection(() =>
  createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.issue_label,
    })
  )
);

/**
 * Resolve a team's id from the (organization slug, team slug) pair using the
 * local `organization` and `team` tables. Team slugs are only unique *within*
 * an organization, so both are required to avoid cross-org collisions.
 */
export function useTeamId(
  orgSlug: string,
  teamSlug: string
): string | undefined {
  const orgCollection = React.useMemo(() => getOrganizationsCollection(), []);
  const teamCollection = React.useMemo(() => getTeamsCollection(), []);

  const { data: orgs = [] } = useLiveQuery(
    (q) => q.from({ org: orgCollection }),
    [orgCollection]
  );
  const { data: teams = [] } = useLiveQuery(
    (q) => q.from({ team: teamCollection }),
    [teamCollection]
  );

  return React.useMemo(() => {
    const orgId = orgs.find((o) => o.slug === orgSlug)?.id;
    if (!orgId) return undefined;
    return teams.find((t) => t.organizationId === orgId && t.slug === teamSlug)
      ?.id;
  }, [orgs, teams, orgSlug, teamSlug]);
}

export type PowerSyncWorkflowState = {
  id: string;
  name: string;
  type: WorkflowGroupType;
  color: string;
  position: number;
  isDefault: boolean;
};

/** Workflow states for a team, read from local SQLite. */
export function usePowerSyncWorkflowStates(
  teamId: string | undefined
): PowerSyncWorkflowState[] {
  const collection = React.useMemo(() => getWorkflowStatesCollection(), []);
  const { data: states = [] } = useLiveQuery(
    (q) => q.from({ state: collection }),
    [collection]
  );
  return React.useMemo(
    () =>
      states
        .filter((s) => s.teamId === teamId)
        .map((s) => ({
          id: s.id as string,
          name: (s.name as string) ?? "",
          type: ((s.type as string) ?? "BACKLOG") as WorkflowGroupType,
          color: (s.color as string) ?? "var(--muted-foreground)",
          position: (s.position as number) ?? 0,
          isDefault: Boolean(s.isDefault),
        })),
    [states, teamId]
  );
}

export type PowerSyncLabelOption = {
  value: string;
  label: string;
  color?: string;
  icon: typeof DotIcon;
};

/** Label options for a team, read from local SQLite (mirrors useTeamLabels). */
export function usePowerSyncTeamLabels(
  teamId: string | undefined
): PowerSyncLabelOption[] {
  const collection = React.useMemo(() => getIssueLabelsCollection(), []);
  const { data: labels = [] } = useLiveQuery(
    (q) => q.from({ label: collection }),
    [collection]
  );
  return React.useMemo(
    () =>
      labels
        .filter((l) => l.teamId === teamId)
        .map((l) => ({
          value: l.id as string,
          label: (l.name as string) ?? "",
          color: (l.color as string) ?? undefined,
          icon: DotIcon,
        })),
    [labels, teamId]
  );
}
