import { Link, useLocation } from "@tanstack/react-router";

import { teamIssueTabs } from "@/config/team";
import { isNavLinkActive } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function IssueTabs({
  organization,
  teamSlug: team,
  tooltipBoundary,
}: {
  organization: string;
  teamSlug: string;
  /** Anchors the tooltips to the toolbar rather than the viewport. */
  tooltipBoundary?: HTMLElement;
}) {
  const { pathname } = useLocation();

  return (
    <div className="flex gap-1.5">
      {teamIssueTabs.map((tab) => (
        <Button
          key={tab.title}
          size="xs"
          variant="outline"
          activable
          isActive={isNavLinkActive(
            pathname,
            tab.url,
            organization,
            team,
            false
          )}
          nativeButton={false}
          tooltip={{
            content: `Open ${tab.title}`,
            kbd: [tab.shortcut],
            tooltipProps: {
              side: "bottom",
              collisionBoundary: tooltipBoundary,
            },
          }}
          render={<Link to={tab.url} params={{ organization, team }} />}
        >
          {tab.title}
        </Button>
      ))}
    </div>
  );
}
