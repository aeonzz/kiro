import { useParams } from "@tanstack/react-router";

import { usePowerSyncIssueByNumber } from "@/lib/collections/issues-powersync";
import { usePowerSyncTeam } from "@/lib/collections/team-metadata-powersync";
import { formatIssueIdentifier } from "@/lib/issue-identifier";
import { IssueActionsToolbar } from "@/components/issue-actions-toolbar";
import { DotmSquare18 } from "@/components/ui/dotm-square-18";

import { IssueActivity } from "./issue-activity";
import { IssueBody } from "./issue-body";
import { IssueProperties } from "./issue-properties";

export function IssueDetail({
  teamSlug,
  number,
}: {
  teamSlug: string;
  number: number;
}) {
  const { organization } = useParams({
    from: "/_app/$organization/_inbox/issue/$issue",
  });

  const { team } = usePowerSyncTeam(organization, teamSlug);
  const { issue } = usePowerSyncIssueByNumber(team?.id, number);

  if (!issue) {
    return <IssueDetailLoader />;
  }

  const identifier = formatIssueIdentifier(teamSlug, number);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="absolute top-2 right-2">
        <IssueActionsToolbar identifier={identifier} />
      </div>
      <div className="grid grid-cols-[1fr_minmax(0,85ch)_minmax(0,clamp(280px,26vw,400px))_1fr] items-start gap-x-4 py-16 md:gap-x-14">
        <div className="relative col-start-2 flex min-w-0 flex-col gap-6">
          <IssueBody
            key={issue.id}
            issue={issue}
            organization={organization}
            issueIdentifier={identifier}
          />
          <IssueActivity
            issueId={issue.id}
            teamId={issue.teamId}
            organization={organization}
          />
        </div>
        <div className="sticky top-14 col-start-3 min-w-0">
          <IssueProperties issue={issue} organization={organization} />
        </div>
      </div>
    </div>
  );
}

function IssueDetailLoader() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <DotmSquare18
        className="text-muted-foreground"
        ariaLabel="Loading issue"
      />
    </div>
  );
}
