import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

import { usePowerSyncIssueByNumber } from "@/lib/collections/issues-powersync";
import { usePowerSyncTeam } from "@/lib/collections/team-metadata-powersync";
import {
  formatIssueIdentifier,
  parseIssueIdentifier,
} from "@/lib/issue-identifier";
import { Container } from "@/components/container";
import { Error } from "@/components/error";

import { Header } from "./-components/header";

export const Route = createFileRoute("/_app/$organization/_inbox/issue/$issue")({
  head: ({ params }) => ({
    meta: [{ title: params.issue }],
  }),
  errorComponent: Error,
  component: RouteComponent,
});

function RouteComponent() {
  const { organization, issue } = Route.useParams();

  // Parsed before the hook so hook order stays stable when navigating from a
  // valid identifier to a malformed one.
  const parsed = parseIssueIdentifier(issue);

  const { team: teamData, isLoading } = usePowerSyncTeam(
    organization,
    parsed?.teamSlug ?? ""
  );

  // Resolved here rather than in the header so the lookup sits beside the team
  // it depends on — the issue is keyed by (teamId, number), not by identifier.
  const { issue: issueData } = usePowerSyncIssueByNumber(
    teamData?.id,
    parsed?.number
  );

  if (!parsed) {
    throw notFound();
  }

  // Only 404 once the local tables have hydrated — otherwise a real issue would
  // flash not-found while the collection is still loading.
  if (!isLoading && !teamData) {
    throw notFound();
  }

  return (
    <Container>
      <Header
        teamName={teamData?.name ?? ""}
        teamSlug={parsed.teamSlug}
        identifier={formatIssueIdentifier(parsed.teamSlug, parsed.number)}
        title={issueData?.title ?? ""}
      />
      <Outlet />
    </Container>
  );
}
