import * as React from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ActivityRow } from "./activity-row";
import type { FeedItem, LookupContext } from "./types";

/** Renders a clustered run (see {@link groupIntoFeedItems}) as one row that
 * shows the latest change, expandable to reveal the intermediate ones. */
export function ActivityCluster({
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
