import * as React from "react";
import { Icon } from "@/utils/icon";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useDroppable,
  type CollisionDetection,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import { User02Icon } from "@hugeicons/core-free-icons";
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
import { useGroupedIssues, type IssueGroup } from "@/hooks/use-grouped-issues";
import { useActiveIssueDisplayOptions } from "@/hooks/use-issue-display-store";
import { useIssueDrag } from "@/hooks/use-issue-drag";
import {
  useIssueFilters,
  useIssuePanelFilters,
} from "@/hooks/use-issue-filter-store";
import { useIssueTabKey } from "@/hooks/use-issue-tab-key";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { orderingLabels } from "./drag-info-bar";
import { GroupCreateIssueButton } from "./group-create-issue-button";
import { IssueBoardCard } from "./issue-board-card";
import { IssueEmptyState } from "./issue-empty-state";
import { IssuesHiddenBar } from "./issues-hidden-bar";

const noOpSortingStrategy: SortingStrategy = () => null;

interface IssueBoardProps {
  issues?: Issue[];
  hiddenCount?: number;
  className?: string;
}

export function IssueBoard({
  issues = [],
  hiddenCount = 0,
  className,
}: IssueBoardProps) {
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

  const { groupedIssues } = useGroupedIssues({
    issues,
    config,
    workflowStates,
    orgMembers,
    teamProjects,
    teamLabels,
  });

  const flattenedIssues = React.useMemo(
    () => groupedIssues.flatMap((g) => g.issues),
    [groupedIssues]
  );

  // Resolve the drop target by pointer position, not by nearest center: empty
  // tall columns have far-off centers that `closestCenter` wrongly picks. Find
  // the column under the pointer, then dive to the closest card within it.
  const collisionDetection = React.useCallback<CollisionDetection>(
    (args) => {
      const pointerCollisions = pointerWithin(args);
      const collisions =
        pointerCollisions.length > 0
          ? pointerCollisions
          : rectIntersection(args);
      const overId = getFirstCollision(collisions, "id");
      if (overId == null) return collisions;

      const group = groupedIssues.find((g) => g.id === overId);
      if (group && group.issues.length > 0) {
        const cardIds = new Set(group.issues.map((i) => i.id));
        const cardCollisions = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (c) => c.id !== overId && cardIds.has(c.id as string)
          ),
        });
        const cardOverId = getFirstCollision(cardCollisions, "id");
        if (cardOverId != null) return [{ id: cardOverId }];
      }
      return [{ id: overId }];
    },
    [groupedIssues]
  );

  const {
    sensors,
    activeIssue,
    overId,
    ctrlHeld,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useIssueDrag({
    groupedIssues,
    flattenedIssues,
    grouping: config.grouping,
    ordering: config.ordering,
    mode: "board",
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={({ over }: DragOverEvent) =>
        handleDragOver((over?.id as string) ?? null)
      }
      onDragEnd={handleDragEnd}
    >
      {flattenedIssues.length === 0 ? (
        <IssueEmptyState
          hasFilters={hasFilters}
          onClearFilters={clearAllFilters}
          teamId={teamId}
        />
      ) : (
        <div className="flex h-full min-w-0 flex-1 flex-col">
          <div
            className={cn(
              "flex min-h-0 flex-1 gap-2 overflow-x-auto p-5.5",
              className
            )}
          >
            {groupedIssues.map((group) => (
              <BoardColumn
                key={group.id}
                group={group}
                activeId={activeIssue?.id ?? null}
                overId={overId}
                ordering={config.ordering}
                ctrlHeld={ctrlHeld}
                grouping={config.grouping}
                teamId={teamId}
              />
            ))}
          </div>
          <IssuesHiddenBar
            hiddenCount={hiddenCount}
            onClear={clearAllFilters}
          />
        </div>
      )}
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeIssue && <IssueBoardCard issue={activeIssue} isDragOverlay />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

function BoardColumn({
  group,
  activeId,
  overId,
  ordering,
  ctrlHeld,
  grouping,
  teamId,
}: {
  group: IssueGroup;
  activeId: string | null;
  overId: string | null;
  ordering?: string;
  ctrlHeld: boolean;
  grouping: string;
  teamId?: string;
}) {
  const issueIds = group.issues.map((i) => i.id);
  const { setNodeRef } = useDroppable({ id: group.id });

  // overId can be a card id inside this column or the column's own group id (empty area)
  const isHoveringThisColumn =
    overId !== null &&
    (group.id === overId || group.issues.some((i) => i.id === overId));
  const isActiveInThisColumn =
    activeId !== null && group.issues.some((i) => i.id === activeId);
  const isCrossColumnHover =
    activeId !== null && isHoveringThisColumn && !isActiveInThisColumn;
  const isSortable =
    !ordering || ordering === "manual" || ordering === "priority";
  const sortingStrategy = isSortable
    ? verticalListSortingStrategy
    : noOpSortingStrategy;
  // Show the info overlay whenever the dragged item hovers a card and the drop
  // won't produce an intuitive reorder: either a different column (changes the
  // group), or the same column when the ordering isn't manually sortable.
  const showInfo =
    activeId !== null &&
    isHoveringThisColumn &&
    !!ordering &&
    ordering !== "manual" &&
    (isCrossColumnHover || !isSortable);
  const orderingLabel = ordering ? (orderingLabels[ordering] ?? ordering) : "";

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-border/50 flex w-84 shrink-0 flex-col gap-2 rounded-xl bg-[color-mix(in_oklab,var(--background),var(--sidebar)_70%)]"
      )}
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ "--bg-color": group.color } as React.CSSProperties}
      >
        {group.icon &&
          (typeof group.icon === "string" ? (
            <Avatar className="size-4.5!">
              <AvatarImage src={group.icon} />
              <AvatarFallback>
                <HugeiconsIcon icon={User02Icon} size={12} />
              </AvatarFallback>
            </Avatar>
          ) : (
            <Icon
              icon={group.icon}
              className="text-muted-foreground size-4"
              color={group.color}
            />
          ))}
        <span className="text-xs-plus text-foreground font-medium">
          {group.label}
        </span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {group.issues.length}
        </span>
        <GroupCreateIssueButton
          grouping={grouping}
          groupId={group.id}
          teamId={teamId}
          className="ml-auto"
        />
      </div>

      <SortableContext items={issueIds} strategy={sortingStrategy}>
        <div className="relative m-2 mt-0 flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto rounded-md pr-1">
            {group.issues.map((issue) => (
              <IssueBoardCard key={issue.id} issue={issue} />
            ))}
          </div>
          {showInfo && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-md bg-black/80 p-4">
              <span className="text-foreground text-xs-plus leading-none font-medium">
                Board ordered by {orderingLabel}
              </span>
              {ordering === "priority" && (
                <span className="text-muted-foreground flex items-center gap-1 text-xs leading-none">
                  {ctrlHeld ? (
                    <>
                      Release{" "}
                      <kbd className="bg-primary text-primary-foreground rounded px-1 py-px font-sans text-[10px] font-medium">
                        Ctrl
                      </kbd>{" "}
                      to just move to group
                    </>
                  ) : (
                    <>
                      Hold{" "}
                      <kbd className="bg-muted text-muted-foreground rounded px-1 py-px font-sans text-[10px] font-medium">
                        Ctrl
                      </kbd>{" "}
                      to also change priority
                    </>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
