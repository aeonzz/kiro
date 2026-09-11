import * as React from "react";
import { useParams } from "@tanstack/react-router";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  IssueCrumb,
  IssueHeaderShell,
  IssuesCrumb,
  TeamCrumb,
} from "@/components/issue-header";
import { IssueNavigation } from "@/components/issue-navigation";

export function Header({
  teamName,
  teamSlug: team,
  identifier,
  title,
  issueId,
  ...props
}: React.ComponentProps<typeof IssueHeaderShell> & {
  teamName: string;
  /**
   * Derived from the issue identifier by the parent route — this route has no
   * `$team` param of its own, so the team crumb needs it passed down.
   */
  teamSlug: string;
  /** Normalized `TEAM-N`, already parsed by the parent route. */
  identifier: string;
  /** Resolved from the local issue row by the parent route; empty while loading. */
  title?: string;
  /** Resolved from the local issue row; undefined while loading. */
  issueId?: string;
}) {
  const { organization } = useParams({
    from: "/_app/$organization/_inbox/issue/$issue",
  });

  return (
    <IssueHeaderShell
      actions={
        <div className="flex items-center gap-2.5">
          <IssueNavigation organization={organization} issueId={issueId} />
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
          <BreadcrumbSeparator />
          <IssueCrumb identifier={identifier} title={title} />
        </BreadcrumbList>
      </Breadcrumb>
    </IssueHeaderShell>
  );
}
