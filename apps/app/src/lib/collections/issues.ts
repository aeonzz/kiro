import { createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import type { QueryClient } from "@tanstack/react-query";
import * as z from "zod";

import { IssuePriority } from "@/types/enums";
import type { Issue } from "@/types/issue";
import type { CreateIssue } from "@/services/issue/schema";
import { createIssueFn, updateIssueFn } from "@/services/issue/server-fn";

import { SHAPE_URL } from "./electric";

/**
 * Raw `issue` table row as synced by Electric. This is the columns-only shape
 * (no joined state or labels) — the denormalized {@link Issue} the UI consumes
 * is reconstructed from this plus the label-link and workflow-state data.
 */
export const issueRowSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  priority: z.enum(IssuePriority),
  teamId: z.string(),
  stateId: z.string(),
  assigneeId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IssueRow = z.infer<typeof issueRowSchema>;

const ISSUE_COLUMNS = [
  "id",
  "number",
  "title",
  "priority",
  "teamId",
  "stateId",
  "assigneeId",
  "createdAt",
  "updatedAt",
] as const;

type IssueCollectionParams = {
  queryClient: QueryClient;
  organizationSlug: string;
  teamSlug: string;
};

type CreateIssueMetadata = {
  data: CreateIssue;
};

function getCreateIssueData(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || !("data" in metadata)) {
    throw new Error("Issue insert metadata is missing create data");
  }

  return (metadata as CreateIssueMetadata).data;
}

function getIssueUpdateData(id: string, changes: Partial<IssueRow>) {
  return {
    id,
    ...(changes.stateId !== undefined && { stateId: changes.stateId }),
    ...(changes.priority !== undefined && { priority: changes.priority }),
    ...(changes.assigneeId !== undefined && {
      assigneeId: changes.assigneeId ?? null,
    }),
  };
}

export function createIssuesCollection({
  organizationSlug,
  teamSlug,
}: IssueCollectionParams) {
  return createCollection(
    electricCollectionOptions({
      id: `issues:${organizationSlug}:${teamSlug}`,
      shapeOptions: {
        url: SHAPE_URL,
        params: {
          table: "issue",
          organization: organizationSlug,
          team: teamSlug,
          columns: [...ISSUE_COLUMNS],
        },
      },
      schema: issueRowSchema,
      getKey: (issue) => issue.id,
      onInsert: async ({ transaction }) => {
        const txids = await Promise.all(
          transaction.mutations.map((mutation) =>
            createIssueFn({
              data: getCreateIssueData(mutation.metadata),
            }).then((result) => result.txid)
          )
        );

        return { txid: txids };
      },
      onUpdate: async ({ transaction }) => {
        const txids = await Promise.all(
          transaction.mutations.map((mutation) =>
            updateIssueFn({
              data: getIssueUpdateData(
                mutation.original.id,
                mutation.changes as Partial<IssueRow>
              ),
            }).then((result) => result.txid)
          )
        );

        return { txid: txids };
      },
    })
  );
}

type IssuesCollection = ReturnType<typeof createIssuesCollection>;

const issuesCollectionsByClient = new WeakMap<
  QueryClient,
  Map<string, IssuesCollection>
>();

export function getIssuesCollection(params: IssueCollectionParams) {
  const key = `${params.organizationSlug}:${params.teamSlug}`;
  let collections = issuesCollectionsByClient.get(params.queryClient);

  if (!collections) {
    collections = new Map();
    issuesCollectionsByClient.set(params.queryClient, collections);
  }

  const existingCollection = collections.get(key);

  if (existingCollection) {
    return existingCollection;
  }

  const collection = createIssuesCollection(params);
  collections.set(key, collection);

  return collection;
}

// Re-exported so consumers can keep importing the denormalized type from here.
export type { Issue };
