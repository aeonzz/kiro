import * as React from "react";
import { DotIcon } from "@/components/icons";
import { useOrganization } from "@/components/organization-context";

export function useTeamLabels(teamSlug: string) {
  const { activeOrganization } = useOrganization();

  return React.useMemo(
    () =>
      (
        activeOrganization?.teams.find((t) => t.slug === teamSlug)
          ?.issueLabels ?? []
      ).map((l) => ({
        value: l.id,
        label: l.name,
        color: l.color,
        icon: DotIcon,
      })),
    [activeOrganization, teamSlug]
  );
}
