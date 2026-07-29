import * as React from "react";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import type { Issue } from "@/types/issue";
import { getIssuesPowerSyncCollection } from "@/lib/collections/issues-powersync";
import { assignInitialPositions, getPositionBetween } from "@/lib/position";
import type { IssueGroup } from "./use-grouped-issues";

const GRABBING_CURSOR_STYLE_ID = "dnd-grabbing-cursor";

// A `body` cursor loses to any element that sets its own cursor (cards use
// `cursor-default`), so force it globally with an injected `!important` rule.
function setGrabbingCursor(active: boolean) {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(GRABBING_CURSOR_STYLE_ID);
  if (active) {
    if (existing) return;
    const style = document.createElement("style");
    style.id = GRABBING_CURSOR_STYLE_ID;
    style.textContent = "* { cursor: grabbing !important; }";
    document.head.appendChild(style);
  } else {
    existing?.remove();
  }
}

interface UseIssueDragOptions {
  groupedIssues: IssueGroup[];
  flattenedIssues: Issue[];
  grouping: string;
  ordering: string | undefined;
  mode?: "list" | "board";
}

export function useIssueDrag({
  groupedIssues,
  flattenedIssues,
  grouping,
  ordering,
  mode = "list",
}: UseIssueDragOptions) {
  const [activeIssue, setActiveIssue] = React.useState<Issue | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [ctrlHeld, setCtrlHeld] = React.useState(false);
  const ctrlHeldRef = React.useRef(false);
  const issuesCollection = getIssuesPowerSyncCollection();

  React.useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "Control") { ctrlHeldRef.current = true; setCtrlHeld(true); }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "Control") { ctrlHeldRef.current = false; setCtrlHeld(false); }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      setGrabbingCursor(false);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeGroupId = React.useMemo(
    () => activeIssue
      ? (groupedIssues.find((g) => g.issues.some((i) => i.id === activeIssue.id))?.id ?? null)
      : null,
    [activeIssue, groupedIssues]
  );

  // Board mode: over.id can be a column group id (empty column hover), so check g.id too.
  const overGroupId = React.useMemo(
    () => overId
      ? (groupedIssues.find((g) => g.id === overId || g.issues.some((i) => i.id === overId))?.id ?? null)
      : null,
    [overId, groupedIssues]
  );

  const isDraggingToOtherGroup =
    activeIssue !== null &&
    activeGroupId !== null &&
    overGroupId !== null &&
    activeGroupId !== overGroupId &&
    grouping !== "none";

  const handleDragStart = ({ active }: DragStartEvent) => {
    const issue = flattenedIssues.find((i) => i.id === active.id);
    setActiveIssue(issue ?? null);
    setOverId(active.id as string);
    setGrabbingCursor(true);
  };

  const handleDragOver = (id: string | null) => setOverId(id);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveIssue(null);
    setOverId(null);
    setGrabbingCursor(false);
    if (!over || active.id === over.id) return;

    const activeGroup = groupedIssues.find((g) =>
      g.issues.some((i) => i.id === active.id)
    );
    if (!activeGroup) return;

    // Match by group id first (board empty-column drops), then by contained issue id
    const overGroup = groupedIssues.find((g) =>
      g.id === (over.id as string) || g.issues.some((i) => i.id === over.id)
    );

    const targetIssue = flattenedIssues.find((i) => i.id === over.id) ?? null;

    // Cross-group drop
    if (overGroup && overGroup.id !== activeGroup.id && grouping !== "none") {
      if (mode === "board") {
        // Board: field value comes from the target column's group id
        let changes: Partial<Issue> | undefined;
        if (grouping === "status") {
          changes = { stateId: overGroup.id };
        } else if (grouping === "assignee") {
          changes = { assigneeId: overGroup.id === "unassigned" ? undefined : overGroup.id };
        } else if (grouping === "project") {
          changes = { projectId: overGroup.id === "no-project" ? undefined : overGroup.id };
        } else if (grouping === "priority") {
          changes = { priority: overGroup.id as Issue["priority"] };
        }

        if (changes) {
          const targetGroupIssues = overGroup.issues;
          const tEffectivePos: Record<string, number> = {};
          for (const issue of targetGroupIssues) {
            if (issue.position !== undefined) tEffectivePos[issue.id] = issue.position;
          }
          const unpositioned = targetGroupIssues.filter((i) => i.position === undefined);
          if (unpositioned.length > 0) {
            const initial = assignInitialPositions(targetGroupIssues.map((i) => i.id));
            for (const [id, pos] of Object.entries(initial)) {
              if (!(id in tEffectivePos)) tEffectivePos[id] = pos;
              issuesCollection.update(id, (draft) => { (draft as any).position = pos; });
            }
          }

          const overIssueIndex = targetGroupIssues.findIndex((i) => i.id === over.id);
          let newPosition: number;
          if (overIssueIndex !== -1) {
            const before = tEffectivePos[targetGroupIssues[overIssueIndex]?.id] ?? null;
            const after = tEffectivePos[targetGroupIssues[overIssueIndex + 1]?.id] ?? null;
            newPosition = getPositionBetween(before, after);
          } else {
            const last = tEffectivePos[targetGroupIssues[targetGroupIssues.length - 1]?.id] ?? null;
            newPosition = getPositionBetween(last, null);
          }

          issuesCollection.update(active.id as string, (draft) => {
            Object.assign(draft, changes);
            (draft as any).position = newPosition;
          });
        }
        return;
      }

      // List mode: field value comes from the hovered issue
      if (!targetIssue) return;
      const changes: Partial<Issue> = {};
      if (grouping === "priority") changes.priority = targetIssue.priority;
      else if (grouping === "status") changes.stateId = targetIssue.stateId;
      else if (grouping === "assignee") changes.assigneeId = targetIssue.assigneeId;
      else if (grouping === "project") changes.projectId = targetIssue.projectId;

      if (ctrlHeldRef.current) {
        if (ordering && ordering !== "manual") {
          if (ordering === "priority") changes.priority = targetIssue.priority;
          else if (ordering === "status") changes.stateId = targetIssue.stateId;
          else if (ordering === "assignee") changes.assigneeId = targetIssue.assigneeId;
          else if (ordering === "project") changes.projectId = targetIssue.projectId;
        }

        const targetGroupIssues = overGroup.issues;
        const targetIndex = targetGroupIssues.findIndex((i) => i.id === over.id);
        if (targetIndex !== -1) {
          const tEffectivePos: Record<string, number> = {};
          for (const issue of targetGroupIssues) {
            if (issue.position !== undefined) tEffectivePos[issue.id] = issue.position;
          }
          const unpositioned = targetGroupIssues.filter((i) => i.position === undefined);
          if (unpositioned.length > 0) {
            const initial = assignInitialPositions(targetGroupIssues.map((i) => i.id));
            for (const [id, pos] of Object.entries(initial)) {
              if (!(id in tEffectivePos)) tEffectivePos[id] = pos;
              issuesCollection.update(id, (draft) => { (draft as any).position = pos; });
            }
          }
          const before = tEffectivePos[targetGroupIssues[targetIndex]?.id] ?? null;
          const after = tEffectivePos[targetGroupIssues[targetIndex + 1]?.id] ?? null;
          issuesCollection.update(active.id as string, (draft) => {
            Object.assign(draft, changes);
            (draft as any).position = getPositionBetween(before, after);
          });
          return;
        }
      }

      if (Object.keys(changes).length > 0) {
        issuesCollection.update(active.id as string, (draft) => {
          Object.assign(draft, changes);
        });
      }
      return;
    }

    // Same-group drop
    const groupIssues = activeGroup.issues;
    const oldIndex = groupIssues.findIndex((i) => i.id === active.id);
    if (oldIndex === -1) return;

    const activeIssueData = groupIssues[oldIndex];
    const isManual = !ordering || ordering === "manual";
    const isPriority = ordering === "priority";

    if (!isManual && !isPriority) return;

    if (isPriority && (ctrlHeldRef.current || mode === "board") && targetIssue && targetIssue.priority !== activeIssueData.priority) {
      issuesCollection.update(active.id as string, (draft) => {
        draft.priority = targetIssue.priority;
      });
    }

    const newIndex = groupIssues.findIndex((i) => i.id === over.id);
    if (newIndex === -1) return;

    const effectivePos: Record<string, number> = {};
    for (const issue of groupIssues) {
      if (issue.position !== undefined) effectivePos[issue.id] = issue.position;
    }
    const unpositioned = groupIssues.filter((i) => i.position === undefined);
    if (unpositioned.length > 0) {
      const initial = assignInitialPositions(groupIssues.map((i) => i.id));
      for (const [id, pos] of Object.entries(initial)) {
        if (!(id in effectivePos)) effectivePos[id] = pos;
        issuesCollection.update(id, (draft) => { (draft as any).position = pos; });
      }
    }

    const reordered = [...groupIssues];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const beforeIssue = reordered[newIndex - 1];
    const afterIssue = reordered[newIndex + 1];
    const before = beforeIssue ? (effectivePos[beforeIssue.id] ?? null) : null;
    const after = afterIssue ? (effectivePos[afterIssue.id] ?? null) : null;

    issuesCollection.update(active.id as string, (draft) => {
      (draft as any).position = getPositionBetween(before, after);
    });
  };

  return {
    sensors,
    activeIssue,
    overId,
    ctrlHeld,
    activeGroupId,
    overGroupId,
    isDraggingToOtherGroup,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
