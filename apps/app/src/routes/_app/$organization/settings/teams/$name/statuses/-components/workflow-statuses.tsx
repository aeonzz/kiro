import * as React from "react";
import {
  getWorkflowIcon,
  workflowGroupLabels,
  workflowGroupOrder,
} from "@/config";
import {
  IssueStatusGroup,
  IssueStatusGroupAction,
  IssueStatusGroupHeader,
  IssueStatusGroupTitle,
  IssueStatusItem,
  IssueStatusItemAction,
  IssueStatusItemContent,
  IssueStatusItemDescription,
  IssueStatusItemMedia,
  IssueStatusItemMeta,
  IssueStatusItemTitle,
  IssueStatusList,
} from "@/routes/_app/$organization/settings/teams/$name/statuses/-components/item";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  DeleteIcon,
  DragDropVerticalIcon,
  Edit02Icon,
  MoreHorizontalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { WorkflowState, WorkflowType } from "@kiro/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import { teamQueries } from "@/lib/query-factory";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { WorkflowStateForm } from "./workflow-state-form";

type WorkflowStateWithCount = WorkflowState & {
  isDefault: boolean;
  _count?: {
    issues: number;
  };
};

type WorkflowGroup = {
  id: WorkflowType;
  label: string;
  states: WorkflowStateWithCount[];
};

const defaultableWorkflowTypes = new Set<WorkflowType>([
  "BACKLOG",
  "UNSTARTED",
]);

function canMakeDefaultWorkflowState(state: WorkflowStateWithCount) {
  return defaultableWorkflowTypes.has(state.type) && !state.isDefault;
}

function isWorkflowStateActionTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest("[data-workflow-state-action]"))
  );
}

const workflowStateSensors = [
  PointerSensor.configure({
    preventActivation: (event) => isWorkflowStateActionTarget(event.target),
  }),
  KeyboardSensor.configure({
    preventActivation: (event) => isWorkflowStateActionTarget(event.target),
  }),
];

function formatIssueCount(count = 0) {
  return `${count} ${count === 1 ? "issue" : "issues"}`;
}

function moveItem<T>(items: T[], from: number, to: number) {
  const nextItems = items.slice();
  const [item] = nextItems.splice(from, 1);

  if (!item) return items;

  nextItems.splice(to, 0, item);
  return nextItems;
}

function buildWorkflowGroups(states: WorkflowStateWithCount[]) {
  const groups = new Map<WorkflowGroup["id"], WorkflowGroup>(
    workflowGroupOrder.map((groupId) => [
      groupId,
      {
        id: groupId,
        label: workflowGroupLabels[groupId],
        states: [],
      },
    ])
  );

  for (const state of states) {
    const groupId = state.type;
    groups.get(groupId)?.states.push(state);
  }

  return workflowGroupOrder
    .map((groupId) => groups.get(groupId))
    .filter((group): group is WorkflowGroup => Boolean(group));
}

function WorkflowStateIcon({ state }: { state: WorkflowStateWithCount }) {
  const Icon = getWorkflowIcon(state.type);

  return (
    <IssueStatusItemMedia
      style={{
        backgroundColor: `color-mix(in oklab, var(--muted) 72%, ${state.color})`,
        color: state.color,
      }}
    >
      <Icon size={18} />
    </IssueStatusItemMedia>
  );
}

function SortableWorkflowStateItem({
  state,
  index,
  isLast,
  canSort,
  isSortingDisabled,
  onEditStart,
  onMakeDefault,
  onDeleteStart,
}: {
  state: WorkflowStateWithCount;
  index: number;
  isLast: boolean;
  canSort: boolean;
  isSortingDisabled: boolean;
  onEditStart: (stateId: string) => void;
  onMakeDefault: (state: WorkflowStateWithCount) => void;
  onDeleteStart: (state: WorkflowStateWithCount) => void;
}) {
  const { handleRef, isDragSource, ref } = useSortable({
    id: state.id,
    index,
    group: state.type,
    type: "workflow-state",
    disabled: isSortingDisabled || !canSort,
  });

  return (
    <div
      ref={(element) => {
        ref(element);
        handleRef(element);
      }}
      className={cn(
        "group/sortable-item relative touch-none",
        isDragSource && "opacity-60"
      )}
    >
      {canSort && (
        <button
          type="button"
          disabled={isSortingDisabled}
          className={cn(
            "text-muted-foreground/60 hover:text-muted-foreground absolute top-1/2 left-0 z-10 grid size-5 -translate-y-1/2 place-items-center rounded-sm opacity-0 transition-opacity outline-none group-focus-within/sortable-item:opacity-100 group-hover/sortable-item:opacity-100",
            !isSortingDisabled && "cursor-grab active:cursor-grabbing",
            isSortingDisabled && "pointer-events-none"
          )}
          aria-label={`Reorder ${state.name} status`}
        >
          <HugeiconsIcon
            icon={DragDropVerticalIcon}
            size={14}
            strokeWidth={2}
          />
        </button>
      )}
      <IssueStatusItem className={cn("px-4", isLast && "border-b-0")}>
        <WorkflowStateIcon state={state} />
        <IssueStatusItemContent>
          <div className="flex min-w-0 items-center gap-1.5">
            <IssueStatusItemTitle>{state.name}</IssueStatusItemTitle>
            {state.isDefault && (
              <IssueStatusItemMeta>· Default</IssueStatusItemMeta>
            )}
          </div>
          <IssueStatusItemDescription>
            {state.description || formatIssueCount(state._count?.issues)}
          </IssueStatusItemDescription>
        </IssueStatusItemContent>
        <IssueStatusItemAction data-workflow-state-action>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Open ${state.name} status actions`}
                />
              }
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {canMakeDefaultWorkflowState(state) && (
                <DropdownMenuItem onClick={() => onMakeDefault(state)}>
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
                  <span>Make default</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEditStart(state.id)}>
                <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteStart(state)}>
                <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </IssueStatusItemAction>
      </IssueStatusItem>
    </div>
  );
}

function WorkflowGroupSection({
  group,
  teamId,
  isCreating,
  isAddDisabled,
  editingStateId,
  onCreatingChange,
  onEditStart,
  onEditCancel,
  onReorder,
}: {
  group: WorkflowGroup;
  teamId?: string;
  isCreating: boolean;
  isAddDisabled: boolean;
  editingStateId: string | null;
  onCreatingChange: (open: boolean) => void;
  onEditStart: (stateId: string) => void;
  onEditCancel: () => void;
  onReorder: (group: WorkflowGroup, stateIds: string[]) => void;
}) {
  const { name, organization } = useParams({
    from: "/_app/$organization/settings/teams/$name/statuses/",
  });
  const qc = useQueryClient();

  const [statePendingDeletion, setStatePendingDeletion] =
    React.useState<WorkflowStateWithCount | null>(null);
  const sortableContainerRef = React.useRef<HTMLDivElement>(null);

  const deleteMutation = useMutation({
    ...teamQueries.mutations.deleteWorkflowState(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: teamQueries.detail({
          organizationSlug: organization,
          slug: name,
        }).queryKey,
      });
      toast("Status deleted.", {
        description: "The workflow state has been removed.",
      });
      setStatePendingDeletion(null);
      onEditCancel();
    },
    onError: (error) => {
      toast.error(error?.message ?? "Something went wrong");
    },
  });
  const updateMutation = useMutation({
    ...teamQueries.mutations.updateWorkflowState(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: teamQueries.detail({
          organizationSlug: organization,
          slug: name,
        }).queryKey,
      });
      toast("Default status updated.", {
        description: "New issues will use this workflow state by default.",
      });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Something went wrong");
    },
  });
  const isSortingDisabled = isCreating || Boolean(editingStateId);
  const canSort = group.states.length > 1;

  function handleMakeDefault(state: WorkflowStateWithCount) {
    updateMutation.mutate({
      data: {
        id: state.id,
        name: state.name,
        description: state.description ?? "",
        color: state.color,
        isDefault: true,
      },
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { source, target } = event.operation;

    if (event.canceled || !source || !target) return;

    const sourceIndex = group.states.findIndex(
      (state) => state.id === source.id
    );
    const targetIndex = group.states.findIndex(
      (state) => state.id === target.id
    );
    const projectedIndex =
      "index" in source && typeof source.index === "number"
        ? source.index
        : targetIndex;

    if (
      sourceIndex < 0 ||
      projectedIndex < 0 ||
      projectedIndex >= group.states.length ||
      sourceIndex === projectedIndex
    ) {
      return;
    }

    const nextStateIds = moveItem(
      group.states,
      sourceIndex,
      projectedIndex
    ).map((state) => state.id);

    onReorder(group, nextStateIds);
  }

  return (
    <Collapsible open={isCreating} onOpenChange={onCreatingChange}>
      <IssueStatusGroup>
        <IssueStatusGroupHeader className="mx-3">
          <IssueStatusGroupTitle>{group.label}</IssueStatusGroupTitle>
          {teamId && (
            <CollapsibleTrigger
              render={<IssueStatusGroupAction disabled={isAddDisabled} />}
            >
              <span className="sr-only">Add {group.label} status</span>
            </CollapsibleTrigger>
          )}
        </IssueStatusGroupHeader>
        <IssueStatusList>
          <div ref={sortableContainerRef} className="overflow-hidden">
            <DragDropProvider
              sensors={workflowStateSensors}
              modifiers={[
                RestrictToElement.configure({
                  element: () => sortableContainerRef.current,
                }),
              ]}
              onDragEnd={handleDragEnd}
            >
              {group.states.map((state, index) => {
                if (editingStateId === state.id && teamId) {
                  return (
                    <WorkflowStateForm
                      key={state.id}
                      mode="edit"
                      stateId={state.id}
                      teamId={teamId}
                      type={group.id}
                      initialValues={{
                        name: state.name,
                        description: state.description ?? "",
                        color: state.color,
                      }}
                      onCancel={onEditCancel}
                    />
                  );
                }

                return (
                  <SortableWorkflowStateItem
                    key={state.id}
                    state={state}
                    index={index}
                    isLast={index === group.states.length - 1 && !isCreating}
                    canSort={canSort}
                    isSortingDisabled={isSortingDisabled}
                    onEditStart={onEditStart}
                    onMakeDefault={handleMakeDefault}
                    onDeleteStart={setStatePendingDeletion}
                  />
                );
              })}
            </DragDropProvider>
          </div>
          {teamId && (
            <CollapsibleContent>
              <WorkflowStateForm
                teamId={teamId}
                type={group.id}
                onCancel={() => onCreatingChange(false)}
              />
            </CollapsibleContent>
          )}
        </IssueStatusList>
        <AlertDialog
          open={Boolean(statePendingDeletion)}
          onOpenChange={(open) => {
            if (!open) setStatePendingDeletion(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this status?</AlertDialogTitle>
              <AlertDialogDescription>
                {statePendingDeletion?._count?.issues
                  ? "Move issues out of this status before deleting it."
                  : `This will permanently delete ${statePendingDeletion?.name ?? "this workflow state"}.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={
                  deleteMutation.isPending ||
                  Boolean(statePendingDeletion?._count?.issues)
                }
                onClick={() => {
                  if (!statePendingDeletion) return;

                  deleteMutation.mutate({
                    data: {
                      id: statePendingDeletion.id,
                    },
                  });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </IssueStatusGroup>
    </Collapsible>
  );
}

export function WorkflowStatuses({
  states,
}: {
  states: WorkflowStateWithCount[];
}) {
  const { name, organization } = useParams({
    from: "/_app/$organization/settings/teams/$name/statuses/",
  });
  const qc = useQueryClient();
  const groups = buildWorkflowGroups(states);
  const teamId = states[0]?.teamId;
  const [creatingGroupId, setCreatingGroupId] =
    React.useState<WorkflowType | null>(null);
  const [editingStateId, setEditingStateId] = React.useState<string | null>(
    null
  );
  const hasActiveForm = Boolean(creatingGroupId || editingStateId);
  const reorderMutation = useMutation({
    ...teamQueries.mutations.reorderWorkflowStates(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: teamQueries.detail({
          organizationSlug: organization,
          slug: name,
        }).queryKey,
      });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Something went wrong");
    },
  });

  return (
    <Card className="gap-0 py-3">
      {groups.map((group) => (
        <WorkflowGroupSection
          key={group.id}
          group={group}
          teamId={teamId}
          isCreating={creatingGroupId === group.id}
          isAddDisabled={hasActiveForm}
          editingStateId={editingStateId}
          onCreatingChange={(open) =>
            setCreatingGroupId((currentGroupId) => {
              if (open) {
                setEditingStateId(null);
                return group.id;
              }
              if (currentGroupId === group.id) return null;
              return currentGroupId;
            })
          }
          onEditStart={(stateId) => {
            setCreatingGroupId(null);
            setEditingStateId(stateId);
          }}
          onEditCancel={() => setEditingStateId(null)}
          onReorder={(group, stateIds) => {
            if (!teamId) return;

            reorderMutation.mutate({
              data: {
                teamId,
                type: group.id,
                stateIds,
              },
            });
          }}
        />
      ))}
    </Card>
  );
}
