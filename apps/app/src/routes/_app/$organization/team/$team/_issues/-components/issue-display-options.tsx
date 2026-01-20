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
  completedIssuesOptions,
  issueDisplayOptions,
  issueGroupOptions,
  issueOrderOptions,
} from "@/config/team";
import { cn } from "@/lib/utils";
import { useActiveIssueDisplayOptions } from "@/hooks/use-issue-display-store";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  OptionControlSelect,
  OptionControlSwitch,
} from "../../../../../../../components/option-control";

interface IssueDisplayOptionsProps extends React.ComponentProps<
  typeof Popover
> {
  tooltipBoundary?: HTMLElement;
}

export function IssueDisplayOptions({
  tooltipBoundary,
  ...props
}: IssueDisplayOptionsProps) {
  const { team } = useParams({ from: "/_app/$organization/team/$team" });
  const {
    grouping,
    ordering,
    direction,
    completedIssues,
    showSubIssues,
    showEmptyGroups,
    displayProperties,
    setGrouping,
    setOrdering,
    setDirection,
    setCompletedIssues,
    setShowSubIssues,
    setShowEmptyGroups,
    setDisplayProperties,
    reset,
    isDefault,
    layout,
    setLayout,
  } = useActiveIssueDisplayOptions(team);

  const selectedGrouping = issueGroupOptions.find((f) => f.value === grouping);
  const selectedOrdering = issueOrderOptions.find((f) => f.value === ordering);
  const selectedCompletedIssues = completedIssuesOptions.find(
    (f) => f.value === completedIssues
  );

  return (
    <Popover {...props}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger render={<Button variant="outline" size="xs" />} />
          }
        >
          <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} />
          <span>Display</span>
        </TooltipTrigger>
        <TooltipContent
          className="space-x-2"
          collisionBoundary={tooltipBoundary}
        >
          <span>Show display options</span>
          <KbdGroup>
            <Kbd>⇧</Kbd>
            <Kbd>V</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" flush>
        <div className="border-border space-y-5 border-b px-4 py-3">
          <Tabs
            value={layout}
            onValueChange={(val) => setLayout(val as "list" | "board")}
          >
            <TabsList
              size="lg"
              className="bg-sidebar/40 w-full *:data-[slot='tooltip-trigger']:flex-col *:data-[slot='tooltip-trigger']:gap-[3px]"
            >
              <Tooltip>
                <TooltipTrigger render={<TabsTrigger value="list" />}>
                  <HugeiconsIcon icon={Menu07Icon} strokeWidth={2} />
                  List
                </TooltipTrigger>
                <TooltipContent className="space-x-2" side="bottom">
                  <span>Toggle layout view</span>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>B</Kbd>
                  </KbdGroup>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<TabsTrigger value="board" />}>
                  <HugeiconsIcon icon={MenuSquareIcon} strokeWidth={2} />
                  Board
                </TooltipTrigger>
                <TooltipContent className="space-x-2" side="bottom">
                  <span>Toggle layout view</span>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>B</Kbd>
                  </KbdGroup>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <OptionControlSelect
              id="grouping"
              label={layout === "list" ? "Grouping" : "Columns"}
              icon={MenuIcon}
              options={issueGroupOptions.filter((option) =>
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
              options={issueOrderOptions}
              value={selectedOrdering}
              onValueChange={(value) => {
                setOrdering(value.value);
              }}
            >
              <Tooltip>
                <TooltipTrigger
                  onClick={() =>
                    setDirection(direction === "asc" ? "desc" : "asc")
                  }
                  render={
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="[&>svg]:text-foreground"
                    />
                  }
                >
                  <HugeiconsIcon
                    icon={Sorting01Icon}
                    strokeWidth={2}
                    className={cn(direction === "asc" && "scale-y-[-1]")}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span>
                    {direction === "asc" ? "Ascending" : "Descending"}
                  </span>
                </TooltipContent>
              </Tooltip>
            </OptionControlSelect>
          </div>
        </div>
        <div className="border-border space-y-2 border-b px-4 py-3">
          <OptionControlSelect
            id="completed-issues"
            label="Completed issues"
            options={completedIssuesOptions}
            value={selectedCompletedIssues}
            onValueChange={(value) => {
              setCompletedIssues(value.value);
            }}
          />
          <OptionControlSwitch
            id="show-sub-issues"
            label="Show sub-issues"
            checked={showSubIssues}
            onCheckedChange={setShowSubIssues}
          />
        </div>
        <div className="space-y-3 px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs">
              {layout === "list" ? "List options" : "Board options"}
            </span>
            <OptionControlSwitch
              id="show-empty-groups"
              label={
                layout === "list" ? "Show empty groups" : "Show empty columns"
              }
              checked={showEmptyGroups}
              onCheckedChange={setShowEmptyGroups}
            />
          </div>
          <Label className="text-muted-foreground text-xs font-normal">
            Display properties
          </Label>
          <ToggleGroup
            value={displayProperties}
            onValueChange={(val) => setDisplayProperties(val as string[])}
            size="sm"
            variant="outline"
            className="flex-wrap"
            multiple
            spacing={1.5}
          >
            {issueDisplayOptions
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
            <Tooltip>
              <TooltipTrigger
                onClick={reset}
                render={
                  <Button
                    variant="ghost"
                    size="xs"
                    className="dark:hover:bg-[color-mix(in_oklab,var(--muted)90%,var(--muted-foreground))]"
                  />
                }
              >
                Reset
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <span>Reset to default</span>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
