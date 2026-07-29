import * as React from "react";
import {
  Notification01Icon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useMatchRoute } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContainerHeader } from "@/components/container";

export const crumbClassName = buttonVariants({
  size: "xs",
  variant: "ghost",
  className: "text-foreground px-1!",
});

const inertCrumbClassName = cn(
  crumbClassName,
  "pointer-events-none bg-transparent hover:bg-transparent"
);

function useIsInsideTeam(organization: string, team: string) {
  const matchRoute = useMatchRoute();
  return !!matchRoute({
    to: "/$organization/team/$team",
    params: { organization, team },
    fuzzy: true,
  });
}

export function TeamCrumb({
  organization,
  teamSlug: team,
  teamName,
}: {
  organization: string;
  teamSlug: string;
  teamName: string;
}) {
  const isHere = useIsInsideTeam(organization, team);

  const label = (
    <React.Fragment>
      <HugeiconsIcon
        icon={User02FreeIcons}
        strokeWidth={2}
        className="size-3.5"
      />
      {teamName}
    </React.Fragment>
  );

  if (isHere) {
    return (
      <BreadcrumbItem>
        <BreadcrumbPage className={inertCrumbClassName}>{label}</BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

  return (
    <BreadcrumbItem>
      <Tooltip>
        <TooltipTrigger
          render={
            <BreadcrumbLink
              // The team index redirects to the last-visited issue tab, so
              // this lands wherever the user left off.
              render={
                <Link
                  to="/$organization/team/$team"
                  params={{ organization, team }}
                  className={crumbClassName}
                />
              }
            >
              {label}
            </BreadcrumbLink>
          }
        />
        <TooltipContent side="bottom">Team overview</TooltipContent>
      </Tooltip>
    </BreadcrumbItem>
  );
}

export function IssuesCrumb({
  organization,
  teamSlug: team,
}: {
  organization: string;
  teamSlug: string;
}) {
  const isHere = useIsInsideTeam(organization, team);

  if (isHere) {
    return (
      <BreadcrumbItem>
        <BreadcrumbPage className={inertCrumbClassName}>Issues</BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

  return (
    <BreadcrumbItem>
      <Tooltip>
        <TooltipTrigger
          render={
            <BreadcrumbLink
              render={
                <Link
                  to="/$organization/team/$team/all"
                  params={{ organization, team }}
                  className={crumbClassName}
                />
              }
            >
              Issues
            </BreadcrumbLink>
          }
        />
        <TooltipContent side="bottom">All issues</TooltipContent>
      </Tooltip>
    </BreadcrumbItem>
  );
}

export function IssueCrumb({
  identifier,
  title,
}: {
  identifier: string;
  /** Empty until the local issue row resolves, so the crumb never flashes. */
  title?: string;
}) {
  return (
    <BreadcrumbItem>
      <BreadcrumbPage className={cn(inertCrumbClassName, "gap-1.5")}>
        <span className="text-muted-foreground">{identifier}</span>
        {title && <span className="max-w-64 truncate">{title}</span>}
      </BreadcrumbPage>
    </BreadcrumbItem>
  );
}

export function IssueHeaderShell({
  children,
  inset = true,
  className,
  ...props
}: React.ComponentProps<typeof ContainerHeader>) {

  return (
    <ContainerHeader
      inset={inset}
      className={cn("justify-between", className)}
      {...props}
    >
      <div className="flex items-center gap-2.5">{children}</div>
      <div className="flex items-center gap-2.5">
        <Button size="icon-xs" variant="ghost">
          <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
        </Button>
      </div>
    </ContainerHeader>
  );
}
