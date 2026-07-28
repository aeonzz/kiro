import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  useChildMatches,
  useLocation,
} from "@tanstack/react-router";
import { useDefaultLayout } from "react-resizable-panels";

import type { Notification } from "@/types/schema-types";
import { notificationQueries } from "@/lib/query-factory";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Container } from "@/components/container";
import { Error } from "@/components/error";

import { InboxFilterList } from "./-components/inbox-filter-list";
import { InboxHeader } from "./-components/inbox-header";
import { NotificationList } from "./-components/notification-list";

export const Route = createFileRoute("/_app/$organization/_inbox")({
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  const { organization } = Route.useParams();
  const { session } = Route.useRouteContext();
  const { pathname, state } = useLocation();
  const childMatches = useChildMatches();

  const { defaultLayout, onLayoutChange } = useDefaultLayout({
    groupId: "inbox-layout-storage",
    // This layout also wraps the standalone issue route, so it renders during
    // SSR where `localStorage` does not exist. Layout persistence is a
    // client-only nicety; skipping it on the server is harmless.
    storage: typeof window === "undefined" ? undefined : localStorage,
  });

  /**
   * Split view is honored only for navigations made during this document's
   * lifetime. History state survives a reload, so without this a refresh of an
   * issue URL would resurrect the inbox panel — a fresh load should be the
   * standalone page.
   *
   * It also keeps SSR and hydration in agreement: the server never receives
   * history state, and neither does the client's first render.
   */
  const initialPathname = React.useRef(pathname);
  const [hasNavigated, setHasNavigated] = React.useState(false);
  // Adjusted during render, not in an effect: an effect would commit one frame
  // on the wrong branch first, which tears down and rebuilds the panel group.
  // Setting state here re-runs this component before the browser paints.
  if (!hasNavigated && pathname !== initialPathname.current) {
    setHasNavigated(true);
  }

  // Notifications are server-only (not synced to PowerSync). Non-suspense query
  // so navigation completes offline with an empty inbox instead of hanging.
  const { data } = useQuery(
    notificationQueries.lists({
      organizationSlug: organization,
      userId: session.user.id,
    })
  );

  /**
   * Decided from the *rendered* match tree, not `pathname`. During a pending
   * navigation the URL updates immediately while the old matches stay on
   * screen, so keying off the pathname collapsed the split while the outlet
   * still held the inbox — producing a full-width "No notifications" under a
   * `/team/.../all` URL. Child matches stay on the active (rendered) route
   * until the next one resolves, so the layout and its content agree.
   *
   * `useChildMatches` only switches to pending matches once they render their
   * pending fallbacks, and no route here defines one.
   */
  const isInbox = childMatches.some(
    (match) => match.routeId === "/_app/$organization/_inbox/inbox/"
  );
  const isIssue = childMatches.some((match) =>
    match.routeId.startsWith("/_app/$organization/_inbox/issue/$issue")
  );

  // The inbox itself always shows the list; the issue page only does so when it
  // was opened from a notification during this document's lifetime.
  const showSplit =
    isInbox || (isIssue && hasNavigated && state.fromInbox === true);

  if (!showSplit) {
    return <Outlet />;
  }

  return (
    <ResizablePanelGroup
      defaultLayout={defaultLayout}
      onLayoutChange={onLayoutChange}
      orientation="horizontal"
    >
      <ResizablePanel
        id="inbox-panel"
        minSize="30%"
        maxSize="50%"
        className="@container/inbox-panel"
      >
        <Container>
          <InboxHeader />
          <div className="flex flex-col gap-0 pt-0">
            <InboxFilterList />
          </div>
          <NotificationList notifications={(data as Notification[]) || []} />
        </Container>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="inbox-content-panel">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
