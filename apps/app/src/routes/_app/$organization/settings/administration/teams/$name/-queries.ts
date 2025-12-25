import { getTeamByIdFn } from "@/services/team/get";
import { queryOptions } from "@tanstack/react-query";

export const teamQueryOptions = ({
  organizationSlug,
  slug,
}: {
  organizationSlug: string;
  slug: string;
}) =>
  queryOptions({
    queryKey: ["team", slug],
    queryFn: () =>
      getTeamByIdFn({
        data: { organizationSlug, slug },
      }),
  });
