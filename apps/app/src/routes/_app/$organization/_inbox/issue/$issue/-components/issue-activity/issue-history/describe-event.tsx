import * as React from "react";

import type { IssuePriority } from "@/types/enums";
import { issuePriorityMap } from "@/config/inbox";
import type { PowerSyncLabelOption } from "@/lib/collections/team-metadata-powersync";

import type {
  DescribedPart,
  HistoryChange,
  HistoryEvent,
  LookupContext,
} from "./types";

function priorityLabel(value: string | null): string {
  const key = (value ?? "NO_PRIORITY") as IssuePriority;
  return issuePriorityMap[key]?.label ?? "No priority";
}

function describeChange(
  change: HistoryChange,
  actorId: string,
  ctx: LookupContext
): string | null {
  switch (change.field) {
    case "created":
      return "created the issue";
    case "title":
      return change.newValue
        ? `changed title to ${change.newValue}`
        : "renamed the issue";
    case "stateId": {
      const from = change.oldValue
        ? ctx.stateById.get(change.oldValue)?.name
        : null;
      const to = change.newValue
        ? ctx.stateById.get(change.newValue)?.name
        : null;
      if (from && to) return `moved from ${from} to ${to}`;
      if (to) return `set status to ${to}`;
      return "changed status";
    }
    case "priority": {
      const isOldNone = !change.oldValue || change.oldValue === "NO_PRIORITY";
      const isNewNone = !change.newValue || change.newValue === "NO_PRIORITY";
      if (isNewNone && !isOldNone) return "removed priority";
      if (isOldNone) return `set priority to ${priorityLabel(change.newValue)}`;
      return `changed priority from ${priorityLabel(change.oldValue)} to ${priorityLabel(change.newValue)}`;
    }
    case "assigneeId": {
      if (!change.newValue) return "unassigned the issue";
      if (change.newValue === actorId) return "self-assigned the issue";
      const assignee = ctx.memberById.get(change.newValue);
      return `assigned the issue to ${assignee?.label ?? "someone"}`;
    }
    case "projectId": {
      if (!change.newValue) return "removed the issue from its project";
      const project = ctx.projectById.get(change.newValue);
      return `added to project ${project?.label ?? "Unknown"}`;
    }
    case "parentId":
      return change.newValue
        ? "set the parent issue"
        : "removed the parent issue";
    default:
      return null;
  }
}

/** Pulls "label" changes out of the per-change loop and merges them into one
 * "added labels X, Y and Z" part instead of one part per label. */
function describeChangeParts(
  changes: HistoryChange[],
  actorId: string,
  ctx: LookupContext
): DescribedPart[] {
  const parts: DescribedPart[] = [];
  const labelAdds: string[] = [];
  const labelRemoves: string[] = [];

  for (const change of changes) {
    if (change.field === "label") {
      if (change.newValue) labelAdds.push(change.newValue);
      else if (change.oldValue) labelRemoves.push(change.oldValue);
      continue;
    }

    const text = describeChange(change, actorId, ctx);
    if (text) parts.push({ kind: "text", text });
  }

  if (labelAdds.length > 0) {
    parts.push({
      kind: "labels",
      verb: labelAdds.length === 1 ? "added label" : "added labels",
      labelIds: labelAdds,
    });
  }
  if (labelRemoves.length > 0) {
    parts.push({
      kind: "labels",
      verb: labelRemoves.length === 1 ? "removed label" : "removed labels",
      labelIds: labelRemoves,
    });
  }

  return parts;
}

function LabelChip({ label }: { label: PowerSyncLabelOption | undefined }) {
  return (
    <span className="text-foreground inline-flex items-center gap-1">
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: label?.color ?? "var(--muted-foreground)" }}
      />
      {label?.label ?? "Unknown label"}
    </span>
  );
}

/** "Bug" / "Bug and Component" / "Bug, Component, and Feature" — an Oxford
 * comma for 3+ items, matching how the label list reads in the reference UI. */
function joinWithOxfordAnd(items: React.ReactNode[]): React.ReactNode {
  if (items.length === 0) return null;
  if (items.length === 1) return items[0];
  if (items.length === 2) {
    return (
      <>
        {items[0]} and {items[1]}
      </>
    );
  }
  return (
    <>
      {items.slice(0, -1).map((item, i) => (
        <React.Fragment key={i}>{item}, </React.Fragment>
      ))}
      and {items[items.length - 1]}
    </>
  );
}

function renderPart(
  part: DescribedPart,
  ctx: LookupContext,
  key: React.Key
): React.ReactNode {
  if (part.kind === "text") {
    return <React.Fragment key={key}>{part.text}</React.Fragment>;
  }

  return (
    <React.Fragment key={key}>
      {part.verb}{" "}
      {joinWithOxfordAnd(
        part.labelIds.map((id) => (
          <LabelChip key={id} label={ctx.labelById.get(id)} />
        ))
      )}
    </React.Fragment>
  );
}

export function describeEvent(
  event: HistoryEvent,
  ctx: LookupContext
): React.ReactNode {
  const parts = describeChangeParts(event.changes, event.actorId, ctx);

  if (parts.length === 0) return "updated the issue";
  if (parts.length === 1) return renderPart(parts[0], ctx, 0);

  return (
    <>
      {parts.slice(0, -1).map((part, i) => (
        <React.Fragment key={i}>
          {renderPart(part, ctx, i)}
          {i < parts.length - 2 ? ", " : " "}
        </React.Fragment>
      ))}
      and {renderPart(parts[parts.length - 1], ctx, parts.length - 1)}
    </>
  );
}
