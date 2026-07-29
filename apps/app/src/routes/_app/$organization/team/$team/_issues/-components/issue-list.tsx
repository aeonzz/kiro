import * as React from "react";
import type { StrictOmit } from "@/types";
import { Icon } from "@/utils/icon";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowRight01Icon,
  CommandIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";
import { createPortal } from "react-dom";

import type { Issue } from "@/types/issue";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  usePowerSyncWorkflowStates,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import {
  GROUP_ID_NO_LABEL,
  useGroupedIssues,
} from "@/hooks/use-grouped-issues";
import { useActiveIssueDisplayOptions } from "@/hooks/use-issue-display-store";
import { useIssueDrag } from "@/hooks/use-issue-drag";
import {
  useIssueFilters,
  useIssuePanelFilters,
} from "@/hooks/use-issue-filter-store";
import { useIssueTabKey } from "@/hooks/use-issue-tab-key";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ListBox } from "@/components/ui/list-box";
import {
  ActionBar,
  ActionBarClose,
  ActionBarContent,
  ActionBarSeparator,
} from "@/components/action-bar";

import { DragInfoBar } from "./drag-info-bar";
import { GroupCreateIssueButton } from "./group-create-issue-button";
import { IssueEmptyState } from "./issue-empty-state";
import { IssueListItem } from "./issue-list-item";
import { IssuesHiddenBar } from "./issues-hidden-bar";

interface IssueListProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {
  issues?: Issue[];
  hiddenCount?: number;
}

export function IssueList({
  className,
  issues = [],
  hiddenCount = 0,
  ...props
}: IssueListProps) {
  const { organization, team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const tabKey = useIssueTabKey(team);
  const config = useActiveIssueDisplayOptions(tabKey);
  const teamId = useTeamId(organization, team);
  const workflowStates = usePowerSyncWorkflowStates(teamId);
  const orgMembers = usePowerSyncOrgMembers(organization);
  const teamProjects = usePowerSyncTeamProjects(teamId);
  const teamLabels = usePowerSyncTeamLabels(teamId);
  // Both scopes narrow the list, so both have to count towards "are there
  // filters" and both have to go when the user clears — clearing only the
  // toolbar's would leave issues hidden with the bar still claiming so.
  const { filters, clearFilters } = useIssueFilters(tabKey);
  const { filters: panelFilters, clearFilters: clearPanelFilters } =
    useIssuePanelFilters(tabKey);
  const hasFilters = filters.length + panelFilters.length > 0;
  const clearAllFilters = () => {
    clearFilters();
    clearPanelFilters();
  };
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const { grouping, ordering } = config;

  const { groupedIssues, flattenedIssues } = useGroupedIssues({
    issues,
    config,
    workflowStates,
    orgMembers,
    teamProjects,
    teamLabels,
  });

  const {
    sensors,
    activeIssue,
    overId,
    ctrlHeld,
    overGroupId,
    isDraggingToOtherGroup,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useIssueDrag({ groupedIssues, flattenedIssues, grouping, ordering });

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { grouping: _g, ...restProps } = { grouping, ...props };

  let cumulativeIndex = 0;

  const listContent = (
    <div
      ref={setContainer}
      className={cn("relative mx-2 h-full min-w-0 flex-1", className)}
    >
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="h-full" {...props}>
          {flattenedIssues.length === 0 && (
            <IssueEmptyState
              hasFilters={hasFilters}
              onClearFilters={clearAllFilters}
              teamId={teamId}
            />
          )}
          <ListBox items={flattenedIssues}>
            {groupedIssues.map((group, groupIndex) => (
              <Collapsible key={group.id} defaultOpen>
                {grouping !== "none" && (
                  // The create trigger is a sibling of the collapsible trigger,
                  // not a child: nesting a button inside a button is invalid and
                  // the click would toggle the group.
                  <div className="group/header relative my-0.5">
                    <CollapsibleTrigger
                      style={
                        { "--bg-color": group.color } as React.CSSProperties
                      }
                      className={cn(
                        "group/trigger before:from-muted-foreground/2 relative h-9 w-full rounded-md outline-none before:absolute before:inset-0 before:bg-linear-to-l before:to-transparent before:content-['']",
                        "to-muted-foreground/2 bg-linear-to-r from-(--bg-color)/5"
                      )}
                    >
                      {(() => {
                        const selectedCount = group.issues.filter((i) =>
                          selectedIds.has(i.id)
                        ).length;
                        return (
                          <div className="flex items-center gap-2.5 px-2 py-2">
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              className="text-muted-foreground size-3.5 transition-transform duration-200 group-data-panel-open/trigger:rotate-90"
                            />
                            {grouping === "label" &&
                            group.id !== GROUP_ID_NO_LABEL ? (
                              <div
                                className="size-2.5 flex-shrink-0 rounded-full"
                                style={{ backgroundColor: group.color }}
                              />
                            ) : (
                              group.icon &&
                              (typeof group.icon === "string" ? (
                                <Avatar className="size-4.5!">
                                  <AvatarImage src={group.icon} />
                                  <AvatarFallback>
                                    <HugeiconsIcon
                                      icon={User02Icon}
                                      size={12}
                                    />
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <Icon
                                  icon={group.icon}
                                  className="text-muted-foreground size-4"
                                  color={group.color}
                                />
                              ))
                            )}
                            <span className="text-xs-plus text-foreground font-normal">
                              {group.label}
                            </span>
                            <span className="text-muted-foreground text-xs-plus leading-none tabular-nums">
                              {group.issues.length}
                            </span>
                            {selectedCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs-plus rounded-sm px-1 py-0.5 leading-none tabular-nums opacity-100 group-data-panel-open/trigger:opacity-0">
                                {selectedCount}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </CollapsibleTrigger>
                    <GroupCreateIssueButton
                      grouping={grouping}
                      groupId={group.id}
                      teamId={teamId}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    />
                  </div>
                )}
                <CollapsibleContent>
                  <div
                    className={cn(
                      "flex flex-col transition-shadow",
                      isDraggingToOtherGroup &&
                        !ctrlHeld &&
                        overGroupId === group.id &&
                        "ring-primary/50 ring-1 ring-inset"
                    )}
                  >
                    {group.issues.map((issue) => {
                      const index = cumulativeIndex++;
                      const isSelected = selectedIds.has(issue.id);
                      const noOpSameGroup =
                        !isDraggingToOtherGroup &&
                        [
                          "title",
                          "created",
                          "updated",
                          "status",
                          "assignee",
                          "project",
                        ].includes(ordering ?? "");
                      const showIndicator =
                        activeIssue !== null &&
                        overId === issue.id &&
                        activeIssue.id !== issue.id &&
                        (!isDraggingToOtherGroup || ctrlHeld) &&
                        !noOpSameGroup;
                      return (
                        <React.Fragment key={issue.id}>
                          <SortableIssueListItem
                            issue={issue}
                            index={index}
                            isSelected={isSelected}
                            toggleId={toggleId}
                            isDragEnabled={true}
                            isBeingDragged={activeIssue?.id === issue.id}
                          />
                          {showIndicator && <DropIndicator />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </ListBox>
          {/* The empty state already explains the filters and offers its own
              Clear, so the bar would only repeat it under a blank list. */}
          {flattenedIssues.length > 0 && (
            <IssuesHiddenBar
              hiddenCount={hiddenCount}
              onClear={clearAllFilters}
            />
          )}
        </div>
        <ActionBar
          open={selectedIds.size > 0}
          onOpenChange={(open) => !open && setSelectedIds(new Set())}
        >
          <ActionBarContent container={container}>
            <ButtonGroup className="*:data-[slot=button]:border-foreground/15 shadow-sm *:data-[slot=button]:border *:data-[slot=button]:border-dashed *:data-[slot=button]:shadow-none">
              <Button variant="ghost" size="sm" className="tabular-nums">
                {selectedIds.size} selected
              </Button>
              <ActionBarClose />
            </ButtonGroup>
            <ActionBarSeparator />
            <Button variant="secondary" size="sm">
              <HugeiconsIcon icon={CommandIcon} strokeWidth={2} />
              Actions
            </Button>
          </ActionBarContent>
        </ActionBar>
      </div>
    </div>
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={({ over }: DragOverEvent) =>
        handleDragOver((over?.id as string) ?? null)
      }
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={flattenedIssues.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {listContent}
      </SortableContext>
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeIssue && <IssueListItemDragClone issue={activeIssue} />}
        </DragOverlay>,
        document.body
      )}
      <DragInfoBar
        open={
          activeIssue !== null &&
          ((ordering && ordering !== "manual") || !!isDraggingToOtherGroup)
        }
        ordering={ordering ?? ""}
        grouping={grouping}
        container={container}
        isDraggingToOtherGroup={!!isDraggingToOtherGroup}
        ctrlHeld={ctrlHeld}
      />
    </DndContext>
  );
}

function DropIndicator() {
  return (
    <div className="relative h-0 w-full">
      <div className="bg-primary absolute inset-x-0 top-0 h-px rounded-full" />
    </div>
  );
}

function IssueListItemDragClone({ issue }: { issue: Issue }) {
  return (
    <div className="bg-background border-border flex h-11 items-center gap-2 rounded-md border px-2 py-1.5 text-sm opacity-90 shadow-lg">
      <span className="text-xs-plus min-w-0 truncate leading-none font-medium tracking-wide">
        {issue.title}
      </span>
    </div>
  );
}

function SortableIssueListItem({
  issue,
  index,
  isSelected,
  toggleId,
  isDragEnabled,
  isBeingDragged,
}: {
  issue: Issue;
  index: number;
  isSelected: boolean;
  toggleId: (id: string) => void;
  isDragEnabled: boolean;
  isBeingDragged: boolean;
}) {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: issue.id,
    disabled: !isDragEnabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...(isDragEnabled ? { ...attributes, ...listeners } : {})}
    >
      <IssueListItem
        issue={issue}
        index={index}
        isSelected={isSelected}
        toggleId={toggleId}
      />
    </div>
  );
}
