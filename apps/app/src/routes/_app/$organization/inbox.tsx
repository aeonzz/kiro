import { createFileRoute } from "@tanstack/react-router";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Container,
  ContainerContent,
  ContainerHeader,
} from "@/components/container";

export const Route = createFileRoute("/_app/$organization/inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel minSize="30%" maxSize="50%">
        <Container>
          <ContainerHeader>
            <SidebarTrigger />
            <p>Inbox</p>
          </ContainerHeader>
          <ContainerContent></ContainerContent>
        </Container>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Container>
          <ContainerContent></ContainerContent>
        </Container>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
