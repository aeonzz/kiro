import * as React from "react";
import { useOrganization } from "@/components/organization-context";

export function useTeamWorkflowStates(teamSlug: string) {
  const { activeOrganization } = useOrganization();

  return React.useMemo(
    () =>
      activeOrganization?.teams.find((t) => t.slug === teamSlug)
        ?.workflowStates ?? [],
    [activeOrganization, teamSlug]
  );
}
