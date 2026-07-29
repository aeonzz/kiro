import * as React from "react";
import { useParams } from "@tanstack/react-router";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  IssueCrumb,
  IssueHeaderShell,
  IssuesCrumb,
  TeamCrumb,
} from "@/components/issue-header";

export function Header({
  teamName,
  teamSlug: team,
  identifier,
  title,
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
}) {
  const { organization } = useParams({
    from: "/_app/$organization/_inbox/issue/$issue",
  });

  return (
    <IssueHeaderShell {...props}>
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
