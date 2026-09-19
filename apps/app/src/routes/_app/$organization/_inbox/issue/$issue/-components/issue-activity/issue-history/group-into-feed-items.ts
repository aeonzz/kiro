import type { FeedItem, HistoryEvent } from "./types";

/** Collapses a run of consecutive single-field events of the same field (e.g.
 * several title edits in a row from rapid typing/autosave) into one
 * collapsible entry whose trigger shows the latest value. */
export function groupIntoFeedItems(events: HistoryEvent[]): FeedItem[] {
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
