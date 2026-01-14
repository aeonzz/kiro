import * as React from "react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Container } from "@/components/container";

import { InboxFilterList } from "./-components/inbox-filter-list";
import { InboxHeader } from "./-components/inbox-header";
import { NotificationList } from "./-components/notification-list";

export const Route = createFileRoute("/_app/$organization/_inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();

  const state = location.state as { viewMode?: string } | undefined;
  const isFullView = state?.viewMode === "full";

  if (isFullView) {
    return <Outlet />;
  }

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel
        minSize="30%"
        maxSize="50%"
        className="@container/inbox-panel"
      >
        <Container>
          <InboxHeader />
          <div className="flex flex-col gap-0 pt-0">
            <InboxFilterList />
          </div>
          <NotificationList />
        </Container>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
