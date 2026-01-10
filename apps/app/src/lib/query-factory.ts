import {
  createOrganizationFn,
  getOrganizationFn,
  updateOrganizationFn,
} from "@/services/organization/server-fn";
import {
  createTeamFn,
  deleteTeamFn,
  getTeamByIdFn,
  getTeamsFn,
  updateTeamFn,
} from "@/services/team/server-fn";
import { queryOptions } from "@tanstack/react-query";

import { authClient } from "./auth-client";

export const userQueries = {
  all: () => ["user"],
  details: () => [...userQueries.all(), "detail"],
  mutations: {
    update: () => ({
      mutationKey: [...userQueries.details(), "update"],
      mutationFn: (variables: {
        data: Parameters<typeof authClient.updateUser>[0];
      }) => authClient.updateUser(variables.data),
    }),
  },
};

export const authQueries = {
  all: () => ["auth"],
  sessions: () =>
    queryOptions({
      queryKey: [...authQueries.all(), "sessions"],
      queryFn: () => authClient.listSessions(),
    }),
  revokeSession: () => ({
    mutationKey: [...authQueries.all(), "revoke-session"],
    mutationFn: (variables: {
      data: Parameters<typeof authClient.revokeSession>[0];
    }) => authClient.revokeSession(variables.data),
  }),
  revokeOtherSessions: () => ({
    mutationKey: [...authQueries.all(), "revoke-other-sessions"],
    mutationFn: () => authClient.revokeOtherSessions(),
  }),
};

export const organizationQueries = {
  all: () => ["organizations"],
  details: () => [...organizationQueries.all(), "detail"],
  detail: ({ slug }: { slug: string }) =>
    queryOptions({
      queryKey: [...organizationQueries.details(), slug],
      queryFn: () => getOrganizationFn({ data: { slug } }),
    }),
  mutations: {
    create: () => ({
      mutationKey: [...organizationQueries.all(), "create"],
      mutationFn: createOrganizationFn,
    }),
    update: () => ({
      mutationKey: [...organizationQueries.all(), "update"],
      mutationFn: updateOrganizationFn,
    }),
    inviteMember: () => ({
      mutationKey: [...organizationQueries.details(), "invite-member"],
      mutationFn: (variables: {
        data: Parameters<typeof authClient.organization.inviteMember>[0];
      }) => authClient.organization.inviteMember(variables.data),
    }),
    removeMember: () => ({
      mutationKey: [...organizationQueries.details(), "remove-member"],
      mutationFn: (variables: {
        data: Parameters<typeof authClient.organization.removeMember>[0];
      }) => authClient.organization.removeMember(variables.data),
    }),
    leaveOrganization: () => ({
      mutationKey: [...organizationQueries.details(), "leave-organization"],
      mutationFn: (variables: {
        data: Parameters<typeof authClient.organization.leave>[0];
      }) => authClient.organization.leave(variables.data),
    }),
    deleteOrganization: () => ({
      mutationKey: [...organizationQueries.details(), "delete-organization"],
      mutationFn: (variables: {
        data: Parameters<typeof authClient.organization.delete>[0];
      }) => authClient.organization.delete(variables.data),
    }),
  },
};

export const teamQueries = {
  all: () => ["teams"],
  lists: ({ organizationSlug }: { organizationSlug: string }) =>
    queryOptions({
      queryKey: [...teamQueries.all(), "list", organizationSlug],
      queryFn: () => getTeamsFn({ data: { organizationSlug } }),
    }),
  details: () => [...teamQueries.all(), "detail"],
  detail: ({
    organizationSlug,
    slug,
  }: {
    organizationSlug: string;
    slug: string;
  }) =>
    queryOptions({
      queryKey: [...teamQueries.details(), slug],
      queryFn: () =>
        getTeamByIdFn({
          data: { organizationSlug, slug },
        }),
      staleTime: 5000,
    }),
  mutations: {
    create: () => ({
      mutationKey: [...teamQueries.all(), "create"],
      mutationFn: createTeamFn,
    }),
    update: () => ({
      mutationKey: [...teamQueries.all(), "update"],
      mutationFn: updateTeamFn,
    }),
    delete: () => ({
      mutationKey: [...teamQueries.all(), "delete"],
      mutationFn: deleteTeamFn,
    }),
  },
};
