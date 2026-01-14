import { InboxIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";

import { Container, ContainerContent } from "@/components/container";

export const Route = createFileRoute(
  "/_app/$organization/_inbox/inbox/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
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
  );
}
