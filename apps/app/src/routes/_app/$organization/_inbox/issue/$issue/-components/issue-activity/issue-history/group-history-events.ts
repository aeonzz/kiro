import type { HistoryEntry, HistoryEvent } from "./types";

/** Consecutive rows written by the same actor in the same mutation (identical
 * timestamp) render as one line, e.g. "self-assigned the issue and set
 * priority to Urgent" instead of two separate rows. */
export function groupHistoryEvents(history: HistoryEntry[]): HistoryEvent[] {
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
