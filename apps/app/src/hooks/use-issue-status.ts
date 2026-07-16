import * as React from "react";
import { getWorkflowIcon } from "@/config";

import type { FilterOption } from "@/types/inbox";
import { useTeamWorkflowStates } from "@/hooks/use-team-workflow-states";

export function useIssueStatusOptions(teamSlug: string): FilterOption[] {
  const workflowStates = useTeamWorkflowStates(teamSlug);
  return React.useMemo(
    () =>
      workflowStates.map((state) => ({
        value: state.id,
        label: state.name,
        icon: getWorkflowIcon(state.type),
        color: state.color,
      })),
    [workflowStates]
  );
}
