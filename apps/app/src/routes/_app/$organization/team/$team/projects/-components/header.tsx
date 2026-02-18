import * as React from "react";
import {
  Folder01Icon,
  Notification01Icon,
  PanelRightIcon,
  PlusSignIcon,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation, useParams } from "@tanstack/react-router";

import { teamIssueTabs } from "@/config/team";
import { cn, isNavLinkActive } from "@/lib/utils";
import { useProjectsPanelStore } from "@/hooks/use-details-panel-store";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ContainerHeader } from "@/components/container";
import { createProjectDialogHandle } from "@/components/create-project-dialog";

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
    from: "/_app/$organization/team/$team/projects",
  });
  const { pathname } = useLocation();
  const { isOpen, toggle } = useProjectsPanelStore();

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
          <Button
            size="xs"
            variant="flatOutline"
            activable
            isActive={isNavLinkActive(
              pathname,
              "/$organization/team/$team/projects/all",
              organization,
              team,
              false
            )}
            nativeButton={false}
            tooltip={{
              content: `Open All projects`,
              kbd: ["1"],
              tooltipProps: {
                side: "bottom",
                collisionBoundary: container ?? undefined,
              },
            }}
            render={
              <Link
                to="/$organization/team/$team/projects/all"
                params={{ organization, team }}
              />
            }
          >
            <HugeiconsIcon
              icon={Folder01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            All projects
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Button
          size="xs"
          variant="ghost"
          tooltip={{
            content: "Create new project",
            kbd: ["P", "then", "N"],
            tooltipProps: {
              side: "bottom",
              collisionBoundary: container ?? undefined,
            },
          }}
          render={<DialogTrigger handle={createProjectDialogHandle} />}
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Add project
        </Button>
        <Separator orientation="vertical" className="my-1" />
        <Button
          size="icon-xs"
          variant="ghost"
          activable
          aria-expanded={isOpen}
          onClick={toggle}
          tooltip={{
            content: isOpen ? "Close details" : "Open details",
            kbd: ["Ctrl", "I"],
            tooltipProps: {
              side: "bottom",
              collisionBoundary: container ?? undefined,
            },
          }}
        >
          <HugeiconsIcon icon={PanelRightIcon} strokeWidth={2} />
        </Button>
      </div>
    </ContainerHeader>
  );
}
