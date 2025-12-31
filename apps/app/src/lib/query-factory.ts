import {
  createOrganizationFn,
  getOrganizationFn,
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
    inviteMember: () => ({
      mutationKey: [...organizationQueries.details(), "invite-member"],
      mutationFn: (variables: {
        data: Parameters<typeof authClient.organization.inviteMember>[0];
      }) => authClient.organization.inviteMember(variables.data),
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
