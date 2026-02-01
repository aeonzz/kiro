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

interface IssueDisplayOptionsProps extends React.ComponentProps<
  typeof Popover
> {
  tooltipBoundary?: HTMLElement;
}

export function IssueDisplayOptions({
  tooltipBoundary,
  ...props
}: IssueDisplayOptionsProps) {
  const { team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
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
        render={PopoverTrigger}
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
            size="xs"
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
