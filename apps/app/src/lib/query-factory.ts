import { getOrganizationFn } from "@/services/organization/get";
import { getTeamByIdFn } from "@/services/team/get";
import { updateTeamFn } from "@/services/team/update";
import { queryOptions } from "@tanstack/react-query";

export const organizationQueries = {
  all: () => ["organizations"],
  details: () => [...organizationQueries.all(), "detail"],
  detail: (slug: string) =>
    queryOptions({
      queryKey: [...organizationQueries.details(), slug],
      queryFn: () => getOrganizationFn({ data: { slug } }),
    }),
};

export const teamQueries = {
  all: () => ["teams"],
  lists: () => [...teamQueries.all(), "list"],
  //   list: (filters: string) =>
  //     queryOptions({
  //       queryKey: [...teamQueries.lists(), filters],
  //       queryFn: () => fetchTeams(filters),
  //     }),
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
    update: () => ({
      mutationFn: updateTeamFn,
    }),
  },
};
