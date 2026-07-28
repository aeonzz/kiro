/**
 * The issue detail body. Rendered by both `index.tsx` (`/issue/DD-4`) and
 * `$title/index.tsx` (`/issue/DD-4/some-title`) — the trailing title slug is
 * cosmetic, exactly as it is in Linear, so both URLs show the same page.
 */
export function IssueDetail({
  teamSlug,
  number,
}: {
  teamSlug: string;
  number: number;
}) {
  return (
    <div className="p-4">
      {teamSlug}-{number}
    </div>
  );
}
