import { createFileRoute, notFound } from "@tanstack/react-router";

import { parseIssueIdentifier } from "@/lib/issue-identifier";

import { IssueDetail } from "./-components/issue-detail";

export const Route = createFileRoute("/_app/$organization/_inbox/issue/$issue/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { issue } = Route.useParams();

  const parsed = parseIssueIdentifier(issue);
  if (!parsed) {
    throw notFound();
  }

  return <IssueDetail teamSlug={parsed.teamSlug} number={parsed.number} />;
}
