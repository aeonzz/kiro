import * as React from "react";
import { StrictOmit } from "@/types";
import { StarIcon, User02FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useIssueDetailsPanelStore } from "@/hooks/use-issue-details-panel-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidePanel } from "@/components/ui/side-panel";

interface DetailsSidePanelProps extends StrictOmit<
  React.ComponentProps<typeof SidePanel>,
  "isOpen"
> {
  title: string;
  team: string;
}

export function DetailsSidePanel({
  title,
  team,
  children,
  ...props
}: DetailsSidePanelProps) {
  const isOpen = useIssueDetailsPanelStore((state) => state.isOpen);

  return (
    <SidePanel isOpen={isOpen} id="details-panel" side="right" {...props}>
      <div className="space-y-4 p-4 pr-8">
        <Badge variant="secondary" className="rounded-none">
          {title}
        </Badge>
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex flex-1 items-center gap-2.5">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon
                icon={User02FreeIcons}
                strokeWidth={2}
                className="size-5"
              />
            </Button>
            <h2 className="absolute right-0 left-12 truncate text-lg font-medium">
              {team}
            </h2>
          </div>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="p-4">{children}</div>
    </SidePanel>
  );
}
