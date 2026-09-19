import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "@tanstack/react-router";

import { slugifyIssueTitle } from "@/lib/issue-identifier";
import {
  useIssueNavigation,
  type IssueNavigation as IssueNavigationState,
} from "@/hooks/use-issue-navigation";

import { Button, type ButtonTooltip } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

/**
 * Linear-style "1 / 6" counter with previous/next buttons that walk through
 * whichever list/board the user opened this issue from.
 */
export function IssueNavigation({
  organization,
  issueId,
}: {
  organization: string;
  issueId?: string;
}) {
  const nav = useIssueNavigation(issueId);

  if (!nav) return null;

  return (
    <div className="text-muted-foreground flex items-center gap-1 text-xs tabular-nums">
      <span className="px-1">
        {nav.index + 1} /{" "}
        <span className="text-muted-foreground/60">{nav.total}</span>
      </span>
      <ButtonGroup>
        <NavButton
          organization={organization}
          entry={nav.next}
          icon={ArrowDown01Icon}
          tooltip={{
            content: "Navigate down",
            kbd: ["J"],
          }}
        />
        <NavButton
          organization={organization}
          entry={nav.previous}
          icon={ArrowUp01Icon}
          tooltip={{
            content: "Navigate up",
            kbd: ["K"],
          }}
        />
      </ButtonGroup>
    </div>
  );
}

function NavButton({
  organization,
  entry,
  icon,
  tooltip,
}: {
  organization: string;
  entry: IssueNavigationState["previous"];
  icon: typeof ArrowUp01Icon;
  tooltip: ButtonTooltip;
}) {
  const navigate = useNavigate();

  return (
    <Button
      size="icon-xs"
      variant="ghost"
      disabled={!entry}
      tooltip={tooltip}
      onClick={() => {
        if (!entry) return;

        void navigate({
          to: "/$organization/issue/$issue/$title",
          params: {
            organization,
            issue: entry.identifier,
            title: slugifyIssueTitle(entry.title),
          },
        });
      }}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} />
    </Button>
  );
}
