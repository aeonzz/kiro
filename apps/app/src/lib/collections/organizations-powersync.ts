import * as React from "react";
import { useLiveQuery } from "@tanstack/react-db";

import {
  getIssueLabelsCollection,
  getMembersCollection,
  getOrganizationsCollection,
  getProjectsCollection,
  getTeamsCollection,
  getUsersCollection,
  getWorkflowStatesCollection,
} from "./team-metadata-powersync";

/**
 * Fully local-first organizations read path. Reconstructs each organization —
 * identity + branding, its teams (with workflow states, labels and projects),
 * and its members (with user) — purely from the local SQLite tables PowerSync
 * syncs. This lets the app resolve and render the active organization with no
 * network round-trip, online or offline.
 *
 * NOT sourced here: `issueDrafts` (kept on the server draft query) and
 * `userRole` (derived by the provider from `members` + the current user id).
 * Browser-only — the collections require the browser PowerSync database.
 */

export type LocalOrganizationMember = {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export type LocalOrganizationTeam = {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string | null;
  workflowStates: Array<Record<string, unknown>>;
  issueLabels: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  // Not synced locally — kept empty so the shape matches the server org and
  // downstream `{ ...team }` spreads don't drop keys.
  teammembers: Array<Record<string, unknown>>;
};

export type LocalOrganization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  logo: string | null;
  metadata: string | null;
  teams: LocalOrganizationTeam[];
  members: LocalOrganizationMember[];
  // Filled in by the provider from the dedicated draft query (server-backed).
  issueDrafts: Array<Record<string, unknown>>;
};

export type UsePowerSyncOrganizationsResult = {
  organizations: LocalOrganization[];
  /** True until the local `organization` collection has loaded its first data. */
  isLoading: boolean;
};

/**
 * Organizations (with teams, workflow states, labels, projects and members)
 * read live from local SQLite. `isLoading` reflects the primary organization
 * collection so callers can distinguish "not loaded yet" from "genuinely empty".
 */
export function usePowerSyncOrganizations(): UsePowerSyncOrganizationsResult {
  const orgCollection = React.useMemo(() => getOrganizationsCollection(), []);
  const teamCollection = React.useMemo(() => getTeamsCollection(), []);
  const stateCollection = React.useMemo(() => getWorkflowStatesCollection(), []);
  const labelCollection = React.useMemo(() => getIssueLabelsCollection(), []);
  const memberCollection = React.useMemo(() => getMembersCollection(), []);
  const userCollection = React.useMemo(() => getUsersCollection(), []);
  const projectCollection = React.useMemo(() => getProjectsCollection(), []);

  const { data: orgs = [], isLoading } = useLiveQuery(
    (q) => q.from({ org: orgCollection }),
    [orgCollection]
  );
  const { data: teams = [] } = useLiveQuery(
    (q) => q.from({ team: teamCollection }),
    [teamCollection]
  );
  const { data: states = [] } = useLiveQuery(
    (q) => q.from({ state: stateCollection }),
    [stateCollection]
  );
  const { data: labels = [] } = useLiveQuery(
    (q) => q.from({ label: labelCollection }),
    [labelCollection]
  );
  const { data: members = [] } = useLiveQuery(
    (q) => q.from({ member: memberCollection }),
    [memberCollection]
  );
  const { data: users = [] } = useLiveQuery(
    (q) => q.from({ user: userCollection }),
    [userCollection]
  );
  const { data: projects = [] } = useLiveQuery(
    (q) => q.from({ project: projectCollection }),
    [projectCollection]
  );

  const organizations = React.useMemo(() => {
    const usersById = new Map(users.map((u) => [u.id as string, u]));

    return orgs.map<LocalOrganization>((org) => ({
      id: org.id as string,
      name: (org.name as string) ?? "",
      slug: (org.slug as string) ?? "",
      createdAt: (org.createdAt as string) ?? "",
      logo: (org.logo as string | null) ?? null,
      metadata: (org.metadata as string | null) ?? null,
      issueDrafts: [],
      members: members
        .filter((m) => m.organizationId === org.id)
        .map((m) => {
          const u = usersById.get(m.userId as string);
          return {
            id: m.id as string,
            userId: m.userId as string,
            organizationId: m.organizationId as string,
            role: (m.role as string) ?? "member",
            createdAt: (m.createdAt as string) ?? "",
            user: {
              id: (m.userId as string) ?? "",
              name: (u?.name as string) ?? "",
              email: (u?.email as string) ?? "",
              image: (u?.image as string | null) ?? null,
            },
          };
        }),
      teams: teams
        .filter((t) => t.organizationId === org.id)
        .map((t) => ({
          id: t.id as string,
          name: (t.name as string) ?? "",
          slug: (t.slug as string) ?? "",
          organizationId: t.organizationId as string,
          createdAt: (t.createdAt as string) ?? "",
          updatedAt: (t.updatedAt as string) ?? null,
          workflowStates: states.filter((s) => s.teamId === t.id),
          issueLabels: labels.filter((l) => l.teamId === t.id),
          projects: projects.filter((p) => p.teamId === t.id),
          teammembers: [],
        })),
    }));
  }, [orgs, teams, states, labels, members, users, projects]);

  return { organizations, isLoading };
}
