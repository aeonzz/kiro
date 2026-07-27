import * as React from "react";
import { useRouterState } from "@tanstack/react-router";

export type IssueTab = "all" | "active" | "backlog";

const IssueTabContext = React.createContext<IssueTab | null>(null);

export function IssueTabProvider({
  tab,
  children,
}: {
  tab: IssueTab;
  children: React.ReactNode;
}) {
  return (
    <IssueTabContext.Provider value={tab}>{children}</IssueTabContext.Provider>
  );
}

function getTabSuffix(pathname: string): IssueTab {
  if (/\/active\/?$/.test(pathname)) return "active";
  if (/\/backlog\/?$/.test(pathname)) return "backlog";
  return "all";
}

// Prefer the tab of the route that owns this subtree over the live pathname.
// The router publishes the new pathname synchronously (useSyncExternalStore),
// while the outgoing route is still mounted — so a pathname-derived key makes
// the old tab render one frame with the incoming tab's grouping and layout.
// Only the toolbar, which sits above the Outlet and belongs to no single tab,
// falls back to the pathname.
export function useIssueTab(): IssueTab {
  const tab = React.useContext(IssueTabContext);
  const pathnameTab = useRouterState({
    select: (s) => getTabSuffix(s.location.pathname),
  });
  return tab ?? pathnameTab;
}

export function useIssueTabKey(team: string): string {
  return `${team}:${useIssueTab()}`;
}

// Which workflow types each tab lists; `all` is unfiltered. Defined once so the
// routes and the filter panel's counts cannot drift on what "active" means — a
// panel reading "3" over a list of 5 is worse than no count at all.
const tabStatusTypes: Record<IssueTab, ReadonlySet<string> | null> = {
  all: null,
  active: new Set(["UNSTARTED", "STARTED"]),
  backlog: new Set(["BACKLOG"]),
};

export function issueTabIncludes(tab: IssueTab, statusType: string): boolean {
  const allowed = tabStatusTypes[tab];
  return allowed === null || allowed.has(statusType);
}
