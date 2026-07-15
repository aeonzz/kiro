import { powerSyncCollectionOptions } from "@tanstack/powersync-db-collection";
import { createCollection } from "@tanstack/react-db";

import { getPowerSyncDb } from "@/lib/powersync/db";
import { AppSchema } from "@/lib/powersync/schema";

function createIssueLabelLinksCollection() {
  return createCollection(
    powerSyncCollectionOptions({
      database: getPowerSyncDb(),
      table: AppSchema.props.issue_label_link,
    })
  );
}

let collection: ReturnType<typeof createIssueLabelLinksCollection> | null = null;

/**
 * Memoized PowerSync collection for the issue<->label join table. Inserting a
 * row links a label to an issue; deleting one unlinks it. Writes go to local
 * SQLite and upload to Postgres via the connector (uploadCrudFn handles the
 * `issue_label_link` table). Browser-only.
 */
export function getIssueLabelLinksCollection() {
  if (typeof window === "undefined") {
    throw new Error("PowerSync collection is only available in the browser");
  }

  if (!collection) {
    collection = createIssueLabelLinksCollection();
  }

  return collection;
}

/** Add a single label to an issue (no-op if already linked). */
export function addIssueLabel(issueId: string, labelId: string) {
  const links = getIssueLabelLinksCollection();
  const exists = links.toArray.some(
    (l) => l.issueId === issueId && l.labelId === labelId
  );
  if (exists) return;
  links.insert({ id: crypto.randomUUID(), issueId, labelId });
}

/** Remove a single label from an issue (no-op if not linked). */
export function removeIssueLabel(issueId: string, labelId: string) {
  const links = getIssueLabelLinksCollection();
  const link = links.toArray.find(
    (l) => l.issueId === issueId && l.labelId === labelId
  );
  if (link) links.delete(link.id);
}

/** Replace an issue's labels with `labelIds`, inserting/deleting link rows to match. */
export function setIssueLabels(issueId: string, labelIds: string[]) {
  const links = getIssueLabelLinksCollection();
  const current = links.toArray.filter((l) => l.issueId === issueId);
  const currentIds = new Set(current.map((l) => l.labelId));
  const next = new Set(labelIds);

  for (const labelId of labelIds) {
    if (!currentIds.has(labelId)) {
      links.insert({ id: crypto.randomUUID(), issueId, labelId });
    }
  }
  for (const link of current) {
    if (link.labelId && !next.has(link.labelId)) {
      links.delete(link.id);
    }
  }
}
