import * as React from "react";
import {
  Notification01Icon,
  PanelRightIcon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation, useParams } from "@tanstack/react-router";

import { teamIssueTabs } from "@/config/team";
import { cn, isNavLinkActive } from "@/lib/utils";
import { useIssueDetailsPanelStore } from "@/hooks/use-issue-details-panel-store";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContainerHeader } from "@/components/container";

export function Header({
  teamName,
  inset = true,
  className,
  ...props
}: React.ComponentProps<typeof ContainerHeader> & {
  teamName: string;
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const { organization, team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const { pathname } = useLocation();
  const { isOpen, toggle } = useIssueDetailsPanelStore();

  return (
    <ContainerHeader
      inset={inset}
      className={cn("justify-between", className)}
      {...props}
      setContainer={setContainer}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div className="bg-muted size-4.5 rounded-sm p-0.5">
            <HugeiconsIcon
              icon={User02FreeIcons}
              strokeWidth={2}
              className="size-3.5"
            />
          </div>
          <h2>{teamName}</h2>
        </div>
        <div className="flex gap-1.5">
          {teamIssueTabs.map((tab) => (
            <Button
              key={tab.title}
              size="xs"
              variant="flatOutline"
              activable
              isActive={isNavLinkActive(
                pathname,
                tab.url,
                organization,
                team,
                false
              )}
              nativeButton={false}
              render={<Link to={tab.url} params={{ organization, team }} />}
            >
              <tab.icon className="size-3.5" />
              {tab.title}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Button size="icon-xs" variant="ghost">
          <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
        </Button>
        <Separator orientation="vertical" className="my-1" />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon-xs"
                variant="ghost"
                activable
                aria-expanded={isOpen}
                onClick={toggle}
              />
            }
          >
            <HugeiconsIcon icon={PanelRightIcon} strokeWidth={2} />
          </TooltipTrigger>
          <TooltipContent
            className="space-x-2"
            side="bottom"
            collisionBoundary={container ?? undefined}
          >
            <span>{isOpen ? "Close details" : "Open details"}</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>I</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
    </ContainerHeader>
  );
}
