import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import type { QueryClient } from "@tanstack/react-query";

import type { Issue } from "@/types/issue";
import type { CreateIssue } from "@/services/issue/schema";
import {
  createIssueFn,
  getTeamIssuesFn,
  updateIssueFn,
} from "@/services/issue/server-fn";

import { issueQueries } from "../query-factory";

type IssueCollectionParams = {
  queryClient: QueryClient;
  organizationSlug: string;
  teamSlug: string;
};

type CreateIssueMetadata = {
  data: CreateIssue;
};

function getCreateIssueData(metadata: unknown): CreateIssue {
  if (!metadata || typeof metadata !== "object" || !("data" in metadata)) {
    throw new Error("Issue insert metadata is missing create data");
  }

  return (metadata as CreateIssueMetadata).data;
}

/**
 * Maps a collection draft's `changes` (a partial {@link Issue}) onto the
 * `updateIssueSchema` shape. Note the field rename: the UI/collection tracks the
 * workflow state as `stateId`, but the server function accepts it under `status`
 * (which it writes to the issue's `stateId` column).
 */
function getIssueUpdateData(id: string, changes: Partial<Issue>) {
  return {
    id,
    ...(changes.stateId !== undefined && { status: changes.stateId }),
    ...(changes.priority !== undefined && { priority: changes.priority }),
    ...(changes.assigneeId !== undefined && {
      assigneeId: changes.assigneeId ?? null,
    }),
    ...(changes.labelIds !== undefined && { labelIds: changes.labelIds }),
  };
}

export function createIssuesCollection({
  queryClient,
  organizationSlug,
  teamSlug,
}: IssueCollectionParams) {
  return createCollection(
    queryCollectionOptions({
      id: `issues:${organizationSlug}:${teamSlug}`,
      queryClient,
      queryKey: issueQueries.lists({ organizationSlug, teamSlug }).queryKey,
      queryFn: () => getTeamIssuesFn({ data: { organizationSlug, teamSlug } }),
      getKey: (issue: Issue) => issue.id,
      onInsert: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map((mutation) =>
            createIssueFn({ data: getCreateIssueData(mutation.metadata) })
          )
        );
      },
      onUpdate: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map((mutation) =>
            updateIssueFn({
              data: getIssueUpdateData(
                (mutation.original as Issue).id,
                mutation.changes as Partial<Issue>
              ),
            })
          )
        );
      },
    })
  );
}

type IssuesCollection = ReturnType<typeof createIssuesCollection>;

const issuesCollectionsByClient = new WeakMap<
  QueryClient,
  Map<string, IssuesCollection>
>();

/**
 * Returns a memoized query-backed issues collection for an (org, team) pair.
 * The collection reads through {@link getTeamIssuesFn} and persists optimistic
 * inserts/updates via the issue server functions — no ElectricSQL sync involved.
 */
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

export type { Issue };
