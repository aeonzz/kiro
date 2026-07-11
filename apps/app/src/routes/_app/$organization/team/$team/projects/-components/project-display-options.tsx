import * as React from "react";
import {
  ArrowUpDownIcon,
  Menu07Icon,
  MenuIcon,
  MenuSquareIcon,
  SlidersHorizontalIcon,
  Sorting01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import {
  closedProjectsOptions,
  projectDisplayOptions,
  projectGroupOptions,
  projectOrderOptions,
} from "@/config/team";
import { cn } from "@/lib/utils";
import { useActiveProjectDisplayOptions } from "@/hooks/use-project-display-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  OptionControlSelect,
  OptionControlSwitch,
} from "../../../../../../../components/option-control";

interface ProjectDisplayOptionsProps extends React.ComponentProps<
  typeof Popover
> {
  tooltipBoundary?: HTMLElement;
}

export function ProjectDisplayOptions({
  tooltipBoundary,
  ...props
}: ProjectDisplayOptionsProps) {
  const { team } = useParams({
    from: "/_app/$organization/team/$team/projects",
  });
  const {
    grouping,
    ordering,
    direction,
    closedProjects,
    showEmptyColumns,
    displayProperties,
    setGrouping,
    setOrdering,
    setDirection,
    setClosedProjects,
    setShowEmptyColumns,
    setDisplayProperties,
    reset,
    isDefault,
    layout,
    setLayout,
  } = useActiveProjectDisplayOptions(team);

  const selectedGrouping = projectGroupOptions.find(
    (f) => f.value === grouping
  );
  const selectedOrdering = projectOrderOptions.find(
    (f) => f.value === ordering
  );
  const selectedClosedProjects = closedProjectsOptions.find(
    (f) => f.value === closedProjects
  );

  return (
    <Popover {...props}>
      <Button
        variant="outline"
        size="xs"
        tooltip={{
          content: "Show display options",
          kbd: ["⇧", "V"],
          tooltipProps: {
            collisionBoundary: tooltipBoundary,
          },
        }}
        render={(triggerProps) => <PopoverTrigger {...triggerProps} />}
      >
        <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} />
        <span>Display</span>
      </Button>
      <PopoverContent align="end" flush>
        <div className="border-border space-y-5 border-b px-4 py-3">
          <Tabs
            value={layout}
            onValueChange={(val) => setLayout(val as "list" | "board")}
          >
            <TabsList
              size="lg"
              className="bg-sidebar/40 w-full *:data-[slot='tabs-trigger']:flex-col *:data-[slot='tabs-trigger']:gap-[3px]"
            >
              <TabsTrigger
                value="list"
                tooltip={{ content: "Toggle layout view", kbd: ["Ctrl", "B"] }}
              >
                <HugeiconsIcon icon={Menu07Icon} strokeWidth={2} />
                List
              </TabsTrigger>
              <TabsTrigger
                value="board"
                tooltip={{ content: "Toggle layout view", kbd: ["Ctrl", "B"] }}
              >
                <HugeiconsIcon icon={MenuSquareIcon} strokeWidth={2} />
                Board
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <OptionControlSelect
              id="grouping"
              label={layout === "list" ? "Grouping" : "Columns"}
              icon={MenuIcon}
              options={projectGroupOptions.filter((option) =>
                layout === "board" ? option.value !== "none" : true
              )}
              value={selectedGrouping}
              onValueChange={(value) => {
                setGrouping(value.value);
              }}
              data-rotate={layout === "board"}
            />
            <OptionControlSelect
              id="ordering"
              label="Ordering"
              icon={ArrowUpDownIcon}
              options={projectOrderOptions}
              value={selectedOrdering}
              onValueChange={(value) => {
                setOrdering(value.value);
              }}
            >
              {selectedOrdering?.value !== "manual" && (
                <Button
                  variant="outline"
                  size="icon-xs"
                  className="[&>svg]:text-foreground"
                  onClick={() =>
                    setDirection(direction === "asc" ? "desc" : "asc")
                  }
                  tooltip={direction === "asc" ? "Ascending" : "Descending"}
                >
                  <HugeiconsIcon
                    icon={Sorting01Icon}
                    strokeWidth={2}
                    className={cn(direction === "asc" && "scale-y-[-1]")}
                  />
                </Button>
              )}
            </OptionControlSelect>
          </div>
        </div>
        <div className="border-border space-y-2 border-b px-4 py-3">
          <OptionControlSelect
            id="closed-projects"
            label="Show closed projects"
            options={closedProjectsOptions}
            value={selectedClosedProjects}
            onValueChange={(value) => {
              setClosedProjects(value.value);
            }}
          />
        </div>
        <div className="space-y-3 px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs">
              {layout === "list" ? "List options" : "Board options"}
            </span>
            {layout === "board" && (
              <OptionControlSwitch
                id="show-empty-columns"
                label="Show empty columns"
                checked={showEmptyColumns}
                onCheckedChange={setShowEmptyColumns}
              />
            )}
          </div>
          <Label className="text-muted-foreground text-xs font-normal">
            Display properties
          </Label>
          <ToggleGroup
            value={displayProperties}
            onValueChange={(val) => setDisplayProperties(val as string[])}
            size="xs"
            variant="outline"
            className="flex-wrap"
            multiple
            spacing={1.5}
          >
            {projectDisplayOptions
              .filter((option) => {
                if (layout === "board") {
                  return (
                    option.value !== "created" && option.value !== "updated"
                  );
                }
                return true;
              })
              .map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  {option.label}
                </ToggleGroupItem>
              ))}
          </ToggleGroup>
        </div>
        {!isDefault && (
          <div className="border-border flex items-center justify-end border-t px-2 py-1.5">
            <Button
              variant="ghost"
              size="xs"
              onClick={reset}
              className="dark:hover:bg-[color-mix(in_oklab,var(--muted)90%,var(--muted-foreground))]"
              tooltip="Reset display options"
            >
              Reset
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
