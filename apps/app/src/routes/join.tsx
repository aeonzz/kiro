import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { BackButton } from "@/components/back-button";
import { CreateOrganization } from "@/components/create-organization";

export const Route = createFileRoute("/join")({
  beforeLoad: async ({ context }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login" });
    }
    return { session: context.session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center">
      <BackButton className="text-muted-foreground absolute top-4 left-4">
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        <span>Back</span>
      </BackButton>
      <CreateOrganization />
    </main>
  );
}
