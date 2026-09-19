import * as React from "react";
import type { Issue } from "@/types/issue";
import { formatIssueIdentifier } from "@/lib/issue-identifier";

import {
  useIssueNavigationStore,
  type IssueNavEntry,
} from "./use-issue-navigation-store";

/**
 * Registers the current list/board's issue order as the set the issue
 * detail page's previous/next navigation should walk through, mirroring
 * Linear (next/prev respects whatever filtered view you came from).
 */
export function useRegisterIssueNavigation(
  issues: Issue[],
  teamSlug: string
) {
  const setEntries = useIssueNavigationStore((state) => state.setEntries);

  React.useEffect(() => {
    const entries: IssueNavEntry[] = issues
      .filter((issue) => typeof issue.number === "number")
      .map((issue) => ({
        id: issue.id,
        identifier: formatIssueIdentifier(teamSlug, issue.number as number),
        title: issue.title,
      }));

    setEntries(entries);
  }, [issues, teamSlug, setEntries]);
}

export type IssueNavigation = {
  index: number;
  total: number;
  previous?: IssueNavEntry;
  next?: IssueNavEntry;
};

/** Where `issueId` sits within the last-registered list, if it's in it. */
export function useIssueNavigation(
  issueId: string | undefined
): IssueNavigation | undefined {
  const entries = useIssueNavigationStore((state) => state.entries);

  return React.useMemo(() => {
    if (!issueId) return undefined;

    const index = entries.findIndex((entry) => entry.id === issueId);
    if (index === -1) return undefined;

    return {
      index,
      total: entries.length,
      previous: index > 0 ? entries[index - 1] : undefined,
      next: index < entries.length - 1 ? entries[index + 1] : undefined,
    };
  }, [entries, issueId]);
}
