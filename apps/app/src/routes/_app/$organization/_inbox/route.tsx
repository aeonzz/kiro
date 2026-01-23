import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useDefaultLayout } from "react-resizable-panels";
import { z } from "zod";

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

const inboxSearchSchema = z.object({
  viewMode: z.enum(["split"]).optional(),
});

export const Route = createFileRoute("/_app/$organization/_inbox")({
  validateSearch: inboxSearchSchema,
  loader: async ({ params: { organization }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      notificationQueries.lists({
        organizationSlug: organization,
        userId: context.session.user.id,
      })
    );

    if (!data) {
      throw notFound();
    }
  },
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  const { viewMode } = Route.useSearch();
  const { organization } = Route.useParams();
  const { session } = Route.useRouteContext();

  const { defaultLayout, onLayoutChange } = useDefaultLayout({
    groupId: "inbox-layout-storage",
    storage: localStorage,
  });

  const { data } = useSuspenseQuery(
    notificationQueries.lists({
      organizationSlug: organization,
      userId: session.user.id,
    })
  );

  if (viewMode !== "split" && !location.pathname.endsWith("/inbox")) {
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
