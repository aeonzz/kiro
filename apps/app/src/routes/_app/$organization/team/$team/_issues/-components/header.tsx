import * as React from "react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  IssueHeaderShell,
  IssuesCrumb,
  TeamCrumb,
} from "@/components/issue-header";

export function Header({
  teamName,
  ...props
}: React.ComponentProps<typeof IssueHeaderShell> & {
  teamName: string;
}) {
  const { organization, team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });

  return (
    <IssueHeaderShell
      actions={
        <div className="flex items-center gap-2.5">
          <Button size="icon-xs" variant="ghost">
            <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
          </Button>
        </div>
      }
      {...props}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <TeamCrumb
            organization={organization}
            teamSlug={team}
            teamName={teamName}
          />
          <BreadcrumbSeparator />
          <IssuesCrumb organization={organization} teamSlug={team} />
        </BreadcrumbList>
      </Breadcrumb>
    </IssueHeaderShell>
  );
}
