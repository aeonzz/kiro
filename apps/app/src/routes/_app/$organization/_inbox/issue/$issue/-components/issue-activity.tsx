import * as React from "react";
import { getWorkflowIcon } from "@/config";
import { Icon } from "@/utils/icon";
import { ArrowDown01Icon, Pen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatDistanceToNowStrict } from "date-fns";

import type { IssuePriority } from "@/types/enums";
import { issuePriorityMap } from "@/config/inbox";
import {
  usePowerSyncIssueHistory,
  type PowerSyncIssueHistoryEntry as HistoryEntry,
} from "@/lib/collections/issue-history-powersync";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  usePowerSyncWorkflowStates,
  type PowerSyncLabelOption,
  type PowerSyncMemberOption,
  type PowerSyncProjectOption,
  type PowerSyncWorkflowState,
} from "@/lib/collections/team-metadata-powersync";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { DotIcon } from "@/components/icons";
import { UserHoverCard } from "@/components/user-hover-card";

type HistoryChange = Pick<HistoryEntry, "field" | "oldValue" | "newValue">;

type HistoryEvent = {
  id: string;
  actorId: string;
  createdAt: string;
  changes: HistoryChange[];
};

type LookupContext = {
  stateById: Map<string, PowerSyncWorkflowState>;
  memberById: Map<string, PowerSyncMemberOption>;
  projectById: Map<string, PowerSyncProjectOption>;
  labelById: Map<string, PowerSyncLabelOption>;
};

/** Consecutive rows written by the same actor in the same mutation (identical
 * timestamp) render as one line, e.g. "self-assigned the issue and set
 * priority to Urgent" instead of two separate rows. */
function groupHistoryEvents(history: HistoryEntry[]): HistoryEvent[] {
  const events: HistoryEvent[] = [];

  for (const entry of history) {
    const last = events[events.length - 1];
    if (
      last &&
      last.actorId === entry.actorId &&
      last.createdAt === entry.createdAt
    ) {
      last.changes.push({
        field: entry.field,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
      });
      continue;
    }

    events.push({
      id: entry.id,
      actorId: entry.actorId,
      createdAt: entry.createdAt,
      changes: [
        {
          field: entry.field,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
        },
      ],
    });
  }

  return events;
}

type FeedItem =
  | { type: "event"; event: HistoryEvent }
  | { type: "cluster"; field: string; events: HistoryEvent[] };

/** Collapses a run of consecutive single-field events of the same field (e.g.
 * several title edits in a row from rapid typing/autosave) into one
 * collapsible entry whose trigger shows the latest value. */
function groupIntoFeedItems(events: HistoryEvent[]): FeedItem[] {
  const items: FeedItem[] = [];

  for (const event of events) {
    const singleField =
      event.changes.length === 1 ? event.changes[0].field : null;
    const last = items[items.length - 1];

    if (singleField && last?.type === "cluster" && last.field === singleField) {
      last.events.push(event);
      continue;
    }

    if (
      singleField &&
      last?.type === "event" &&
      last.event.changes.length === 1 &&
      last.event.changes[0].field === singleField
    ) {
      items[items.length - 1] = {
        type: "cluster",
        field: singleField,
        events: [last.event, event],
      };
      continue;
    }

    items.push({ type: "event", event });
  }

  return items;
}

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

type DescribedPart =
  | { kind: "text"; text: string }
  | { kind: "labels"; verb: string; labelIds: string[] };

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

function describeEvent(event: HistoryEvent, ctx: LookupContext): React.ReactNode {
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

const RELATIVE_UNIT_ABBREVIATIONS: Record<string, string> = {
  second: "s",
  minute: "m",
  hour: "h",
  day: "d",
  week: "w",
  month: "mo",
  year: "y",
};

/** "8 weeks" -> "8w ago", matching Linear's compact activity timestamps. */
function formatShortRelativeTime(iso: string): string {
  const distance = formatDistanceToNowStrict(new Date(iso));
  const [value, unit] = distance.split(" ");
  const abbreviation =
    RELATIVE_UNIT_ABBREVIATIONS[unit.replace(/s$/, "")] ?? unit;
  return `${value}${abbreviation} ago`;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ActivityIcon({
  event,
  actor,
  stateById,
}: {
  event: HistoryEvent;
  actor: PowerSyncMemberOption | undefined;
  stateById: Map<string, PowerSyncWorkflowState>;
}) {
  const singleField = event.changes.length === 1 ? event.changes[0] : null;

  if (singleField?.field === "title") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center">
        <HugeiconsIcon
          icon={Pen01Icon}
          strokeWidth={2}
          className="text-muted-foreground size-4"
        />
      </span>
    );
  }

  if (singleField?.field === "priority") {
    const priority = (singleField.newValue ?? "NO_PRIORITY") as IssuePriority;
    const meta = issuePriorityMap[priority] ?? issuePriorityMap.NO_PRIORITY;
    return (
      <span className="flex size-5 shrink-0 items-center justify-center">
        <Icon icon={meta.icon} className="size-4" />
      </span>
    );
  }

  if (singleField?.field === "stateId") {
    const state = singleField.newValue
      ? stateById.get(singleField.newValue)
      : undefined;
    return (
      <span className="flex size-5 shrink-0 items-center justify-center">
        <Icon
          icon={getWorkflowIcon(state?.type ?? "BACKLOG")}
          color={state?.color}
        />
      </span>
    );
  }

  const avatar = (
    <Avatar size="sm" className="size-5!">
      <AvatarImage src={actor?.avatarUrl} />
      <AvatarFallback className="text-[9px] leading-none">
        {getInitials(actor?.label)}
      </AvatarFallback>
    </Avatar>
  );

  return actor ? <UserHoverCard user={actor}>{avatar}</UserHoverCard> : avatar;
}

function ActivityRow({
  event,
  ctx,
  trailing,
}: {
  event: HistoryEvent;
  ctx: LookupContext;
  trailing?: React.ReactNode;
}) {
  const actor = ctx.memberById.get(event.actorId);

  return (
    <div className="text-muted-foreground flex min-w-0 flex-1 items-center gap-2 text-xs">
      <ActivityIcon event={event} actor={actor} stateById={ctx.stateById} />
      <span className="min-w-0 truncate">
        {actor ? (
          <UserHoverCard user={actor}>
            <span className="hover:text-foreground font-medium transition-colors">
              {actor.label}
            </span>
          </UserHoverCard>
        ) : (
          <span className="font-medium">Someone</span>
        )}{" "}
        {describeEvent(event, ctx)}
      </span>
      <DotIcon size={4} />
      <span className="shrink-0 text-xs">
        {formatShortRelativeTime(event.createdAt)}
      </span>
      {trailing}
    </div>
  );
}

/** Renders a clustered run (see {@link groupIntoFeedItems}) as one row that
 * shows the latest change, expandable to reveal the intermediate ones. */
function ActivityCluster({
  cluster,
  ctx,
}: {
  cluster: Extract<FeedItem, { type: "cluster" }>;
  ctx: LookupContext;
}) {
  const [open, setOpen] = React.useState(false);
  const latest = cluster.events[cluster.events.length - 1];
  const earlier = cluster.events.slice(0, -1);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className="hover:bg-muted/40 -mx-1 flex w-full items-center rounded-md px-1 py-0.5 text-left transition-colors data-panel-open:[&_svg]:rotate-0"
        render={<button type="button" />}
      >
        <ActivityRow
          event={latest}
          ctx={ctx}
          trailing={
            <span className="text-muted-foreground ml-1 flex shrink-0 items-center gap-1">
              <span className="tabular-nums">+{earlier.length}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                className="ease-out-expo -rotate-90 transition-transform duration-200"
              />
            </span>
          }
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 pt-3 pl-6">
          {earlier.map((event) => (
            <ActivityRow key={event.id} event={event} ctx={ctx} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function IssueActivity({
  issueId,
  teamId,
  organization,
}: {
  issueId: string;
  teamId?: string;
  organization: string;
}) {
  const history = usePowerSyncIssueHistory(issueId);

  const members = usePowerSyncOrgMembers(organization);
  const workflowStates = usePowerSyncWorkflowStates(teamId);
  const projects = usePowerSyncTeamProjects(teamId);
  const labels = usePowerSyncTeamLabels(teamId);

  const memberById = React.useMemo(
    () => new Map(members.map((member) => [member.value, member])),
    [members]
  );
  const stateById = React.useMemo(
    () => new Map(workflowStates.map((state) => [state.id, state])),
    [workflowStates]
  );
  const projectById = React.useMemo(
    () => new Map(projects.map((project) => [project.value, project])),
    [projects]
  );
  const labelById = React.useMemo(
    () => new Map(labels.map((label) => [label.value, label])),
    [labels]
  );

  const events = React.useMemo(() => groupHistoryEvents(history), [history]);
  const feedItems = React.useMemo(() => groupIntoFeedItems(events), [events]);
  const ctx = React.useMemo<LookupContext>(
    () => ({ stateById, memberById, projectById, labelById }),
    [stateById, memberById, projectById, labelById]
  );

  if (feedItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 px-7">
      <Separator />
      <h3 className="text-sm font-semibold">Activity</h3>
      <ul className="flex flex-col gap-3 px-3">
        {feedItems.map((item) =>
          item.type === "cluster" ? (
            <li key={item.events[item.events.length - 1].id}>
              <ActivityCluster cluster={item} ctx={ctx} />
            </li>
          ) : (
            <li key={item.event.id}>
              <ActivityRow event={item.event} ctx={ctx} />
            </li>
          )
        )}
      </ul>
    </div>
  );
}
