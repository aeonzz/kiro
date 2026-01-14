import * as React from "react";
import { InboxIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Container, ContainerContent } from "@/components/container";

import { InboxFilterList } from "./-components/inbox-filter-list";
import { InboxHeader } from "./-components/inbox-header";

export const Route = createFileRoute("/_app/$organization/inbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel minSize="30%" maxSize="50%">
        <Container ref={setContainer}>
          <InboxHeader containerRef={container} />
          <ContainerContent className="flex flex-col gap-0 pt-0">
            <InboxFilterList containerRef={container} />
          </ContainerContent>
        </Container>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Container>
          <ContainerContent className="flex items-center justify-center">
            <div className="space-y-2 text-center">
              <HugeiconsIcon
                icon={InboxIcon}
                strokeWidth={0.5}
                className="size-24"
              />
              <span className="text-xs-plus text-muted-foreground font-normal">
                No notifications
              </span>
            </div>
          </ContainerContent>
        </Container>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
