import { createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import type { QueryClient } from "@tanstack/react-query";
import * as z from "zod";

import { addIssueLabelFn, removeIssueLabelFn } from "@/services/issue/server-fn";

import { SHAPE_URL } from "./electric";

/**
 * Raw `issue_label_on_issue` join row as synced by Electric. One row per
 * (issue, label) assignment; the collection key is the composite pair.
 */
export const issueLabelLinkRowSchema = z.object({
  issueId: z.string(),
  labelId: z.string(),
  teamId: z.string(),
});

export type IssueLabelLinkRow = z.infer<typeof issueLabelLinkRowSchema>;

const LINK_COLUMNS = ["issueId", "labelId", "teamId"] as const;

export function issueLabelLinkKey(issueId: string, labelId: string) {
  return `${issueId}:${labelId}`;
}

type IssueLabelLinksParams = {
  queryClient: QueryClient;
  organizationSlug: string;
  teamSlug: string;
};

export function createIssueLabelLinksCollection({
  organizationSlug,
  teamSlug,
}: IssueLabelLinksParams) {
  return createCollection(
    electricCollectionOptions({
      id: `issue-label-links:${organizationSlug}:${teamSlug}`,
      shapeOptions: {
        url: SHAPE_URL,
        params: {
          table: "issue_label_on_issue",
          organization: organizationSlug,
          team: teamSlug,
          columns: [...LINK_COLUMNS],
        },
      },
      schema: issueLabelLinkRowSchema,
      getKey: (link) => issueLabelLinkKey(link.issueId, link.labelId),
      onInsert: async ({ transaction }) => {
        const txids = await Promise.all(
          transaction.mutations.map((mutation) =>
            addIssueLabelFn({
              data: {
                issueId: mutation.modified.issueId,
                labelId: mutation.modified.labelId,
              },
            }).then((result) => result.txid)
          )
        );

        return { txid: txids };
      },
      onDelete: async ({ transaction }) => {
        const txids = await Promise.all(
          transaction.mutations.map((mutation) =>
            removeIssueLabelFn({
              data: {
                issueId: mutation.original.issueId,
                labelId: mutation.original.labelId,
              },
            }).then((result) => result.txid)
          )
        );

        return { txid: txids };
      },
    })
  );
}

type IssueLabelLinksCollection = ReturnType<
  typeof createIssueLabelLinksCollection
>;

const linksCollectionsByClient = new WeakMap<
  QueryClient,
  Map<string, IssueLabelLinksCollection>
>();

export function getIssueLabelLinksCollection(params: IssueLabelLinksParams) {
  const key = `${params.organizationSlug}:${params.teamSlug}`;
  let collections = linksCollectionsByClient.get(params.queryClient);

  if (!collections) {
    collections = new Map();
    linksCollectionsByClient.set(params.queryClient, collections);
  }

  const existingCollection = collections.get(key);

  if (existingCollection) {
    return existingCollection;
  }

  const collection = createIssueLabelLinksCollection(params);
  collections.set(key, collection);

  return collection;
}
