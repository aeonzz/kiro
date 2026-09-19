import type * as React from "react";
import { formatShortRelativeTime } from "@/utils/format-date";

import { DotIcon } from "@/components/icons";
import { UserHoverCard } from "@/components/user-hover-card";

import { ActivityIcon } from "./activity-icon";
import { describeEvent } from "./describe-event";
import type { HistoryEvent, LookupContext } from "./types";

export function ActivityRow({
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
