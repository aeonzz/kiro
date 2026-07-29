import { createFileRoute, notFound } from "@tanstack/react-router";

import { parseIssueIdentifier } from "@/lib/issue-identifier";

import { IssueDetail } from "../-components/issue-detail";

export const Route = createFileRoute(
  "/_app/$organization/_inbox/issue/$issue/$title/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { issue } = Route.useParams();

  // `$title` is a cosmetic slug — it is never read. The issue is identified by
  // `$issue` alone, so a stale or wrong title in the URL still resolves.
  const parsed = parseIssueIdentifier(issue);
  if (!parsed) {
    throw notFound();
  }

  return <IssueDetail teamSlug={parsed.teamSlug} number={parsed.number} />;
}
