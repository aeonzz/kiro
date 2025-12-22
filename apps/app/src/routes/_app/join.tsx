import * as React from "react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";

import { Spinner } from "@/components/ui/spinner";
import { BackButton } from "@/components/back-button";
import { CreateOrganization } from "@/components/create-organization";
import { useOrganization } from "@/components/organization-context";

export const Route = createFileRoute("/_app/join")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isPending } = useOrganization();
  return (
    <main className="relative flex h-screen w-full items-center justify-center">
      {isPending ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <BackButton className="text-muted-foreground absolute top-4 left-4">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            <span>Back</span>
          </BackButton>
          <CreateOrganization />
        </React.Fragment>
      )}
    </main>
  );
}
