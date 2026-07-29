import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

/**
 * Footer note for the issues the active filters exclude, shown under both the
 * list and the board. Renders nothing while nothing is hidden, so the row only
 * appears once the view is showing fewer issues than the tab actually holds.
 *
 * Counted before grouping runs, so it reflects the filters alone — display
 * options that hide issues (completed cutoff, sub-issues) are not "filters"
 * here and clearing would not bring those back.
 */
export function IssuesHiddenBar({
  hiddenCount,
  onClear,
}: {
  hiddenCount: number;
  onClear: () => void;
}) {
  if (hiddenCount <= 0) return null;

  return (
    <div className="mt-8 text-muted-foreground flex items-center justify-center gap-1.5 px-3 py-2 text-xs">
      <span>
        <span className="text-foreground font-medium tabular-nums">
          {hiddenCount} {hiddenCount === 1 ? "issue" : "issues"}
        </span>{" "}
        hidden by filters
      </span>
      <Button variant="ghost" size="xs" onClick={onClear}>
        Clear Filters
        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
      </Button>
    </div>
  );
}
