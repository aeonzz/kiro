import { prisma, type Prisma } from "@kiro/db";

export type CrudOp = {
  op: "PUT" | "PATCH" | "DELETE";
  table: string;
  id: string;
  data: Record<string, unknown>;
};

function parseDescription(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Prisma.InputJsonValue;
    } catch {
      return undefined;
    }
  }
  return value as Prisma.InputJsonValue;
}

/**
 * Builds the set of issue columns to write from a CRUD op's data. Only known,
 * client-writable columns are copied — server-owned fields (creatorId, joins)
 * are never taken from the client payload.
 */
function toIssueWriteData(
  data: Record<string, unknown>
): Prisma.IssueUncheckedUpdateInput {
  const out: Prisma.IssueUncheckedUpdateInput = {};
  if (typeof data.title === "string") out.title = data.title;
  if (typeof data.number === "number") out.number = data.number;
  if (typeof data.priority === "string") {
    out.priority =
      data.priority as Prisma.IssueUncheckedUpdateInput["priority"];
  }
  if (typeof data.stateId === "string") out.stateId = data.stateId;
  if ("assigneeId" in data)
    out.assigneeId = (data.assigneeId as string) ?? null;
  if ("projectId" in data) out.projectId = (data.projectId as string) ?? null;
  if ("parentId" in data) out.parentId = (data.parentId as string) ?? null;
  if ("cycleId" in data) out.cycleId = (data.cycleId as string) ?? null;
  if (data.position !== undefined && data.position !== null) {
    const pos = Number(data.position);
    if (!isNaN(pos)) out.position = pos;
  }

  const description = parseDescription(data.description);
  if (description !== undefined) out.description = description;

  return out;
}

// Issue columns that get an IssueHistory entry when changed via a PATCH op.
const TRACKED_HISTORY_FIELDS = [
  "title",
  "stateId",
  "priority",
  "assigneeId",
  "projectId",
  "parentId",
] as const;
type TrackedHistoryField = (typeof TRACKED_HISTORY_FIELDS)[number];

function diffTrackedFields(
  existing: Record<string, unknown>,
  changes: Record<string, unknown>
): Array<{
  field: TrackedHistoryField;
  oldValue: string | null;
  newValue: string | null;
}> {
  const diffs: Array<{
    field: TrackedHistoryField;
    oldValue: string | null;
    newValue: string | null;
  }> = [];

  for (const field of TRACKED_HISTORY_FIELDS) {
    if (!(field in changes)) continue;
    const oldValue = (existing[field] as string | null) ?? null;
    const newValue = (changes[field] as string | null) ?? null;
    if (oldValue !== newValue) {
      diffs.push({ field, oldValue, newValue });
    }
  }

  return diffs;
}

/**
 * Applies a batch of PowerSync CRUD operations for the `issue` table, enforcing
 * that the acting user can access the target team. Runs in a single transaction
 * so a batch either fully lands or fully retries.
 *
 * Only `issue` is client-writable; workflow states and labels are sync-down only
 * and any op for another table is ignored.
 */
export async function applyIssueCrud({
  userId,
  ops,
}: {
  userId: string;
  ops: CrudOp[];
}): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Shared across every history row created by this batch so edits landing
    // together (e.g. a priority change alongside a label add) group into one
    // activity entry client-side instead of several with near-identical times.
    const createdAt = new Date();

    for (const op of ops) {
      if (op.table === "issue_label_link") {
        if (op.op === "DELETE") {
          const existingLink = await tx.issueLabelLink.findFirst({
            where: {
              id: op.id,
              issue: {
                team: { organization: { members: { some: { userId } } } },
              },
            },
            select: { issueId: true, labelId: true },
          });
          if (existingLink) {
            await tx.issueLabelLink.delete({ where: { id: op.id } });
            await tx.issueHistory.create({
              data: {
                issueId: existingLink.issueId,
                actorId: userId,
                field: "label",
                oldValue: existingLink.labelId,
                newValue: null,
                createdAt,
              },
            });
          }
          continue;
        }

        // PUT — create the link after verifying access to the target issue.
        const issueId = op.data.issueId;
        const labelId = op.data.labelId;
        if (typeof issueId !== "string" || typeof labelId !== "string") {
          throw new Error("Label link is missing issueId or labelId");
        }

        const issue = await tx.issue.findFirst({
          where: {
            id: issueId,
            team: { organization: { members: { some: { userId } } } },
          },
          select: { id: true },
        });
        if (!issue) {
          throw new Error("Forbidden: no access to issue");
        }

        // Check first so a retried/idempotent upsert doesn't record a second
        // "added" entry for a link that was already there.
        const existingLink = await tx.issueLabelLink.findFirst({
          where: { id: op.id },
          select: { id: true },
        });

        await tx.issueLabelLink.upsert({
          where: { id: op.id },
          create: { id: op.id, issueId, labelId },
          update: {},
        });

        if (!existingLink) {
          await tx.issueHistory.create({
            data: {
              issueId,
              actorId: userId,
              field: "label",
              oldValue: null,
              newValue: labelId,
              createdAt,
            },
          });
        }
        continue;
      }

      if (op.table === "issue_comment") {
        if (op.op === "DELETE") {
          // Only the author may delete their own comment. Replies cascade
          // via the schema's onDelete: Cascade on the parent relation.
          const existing = await tx.issueComment.findFirst({
            where: { id: op.id, userId },
            select: { id: true },
          });
          if (existing) {
            await tx.issueComment.delete({ where: { id: op.id } });
          }
          continue;
        }

        if (op.op === "PATCH") {
          // Resolving/unresolving is allowed for any org member; editing the
          // body is author-only.
          const existing = await tx.issueComment.findFirst({
            where: {
              id: op.id,
              issue: {
                team: { organization: { members: { some: { userId } } } },
              },
            },
            select: { id: true, parentId: true, userId: true },
          });
          if (!existing) continue;

          if ("resolvedAt" in op.data) {
            const resolvedAt = op.data.resolvedAt;

            if (typeof resolvedAt === "string") {
              // A thread has at most one resolution flag — resolving this
              // comment clears any other resolved comment in the same thread.
              const threadRootId = existing.parentId ?? existing.id;
              await tx.issueComment.updateMany({
                where: {
                  id: { not: op.id },
                  resolvedAt: { not: null },
                  OR: [{ id: threadRootId }, { parentId: threadRootId }],
                },
                data: { resolvedAt: null, resolvedById: null },
              });

              await tx.issueComment.update({
                where: { id: op.id },
                data: {
                  resolvedAt: new Date(resolvedAt),
                  resolvedById: userId,
                },
              });
            } else {
              await tx.issueComment.update({
                where: { id: op.id },
                data: { resolvedAt: null, resolvedById: null },
              });
            }
          }

          if (typeof op.data.body === "string") {
            if (existing.userId !== userId) {
              throw new Error(
                "Forbidden: only the author can edit this comment"
              );
            }
            const body = op.data.body.trim();
            if (body) {
              await tx.issueComment.update({
                where: { id: op.id },
                data: { body },
              });
            }
          }

          continue;
        }

        // op.op === "PUT" — creation.
        const issueId = op.data.issueId;
        const body = op.data.body;
        if (typeof issueId !== "string" || typeof body !== "string") {
          throw new Error("Comment is missing issueId or body");
        }

        const issue = await tx.issue.findFirst({
          where: {
            id: issueId,
            team: { organization: { members: { some: { userId } } } },
          },
          select: { id: true },
        });
        if (!issue) {
          throw new Error("Forbidden: no access to issue");
        }

        // Threading is one level deep — a reply's parent must be a top-level
        // comment on the same issue, never another reply or another issue's row.
        let parentId: string | null = null;
        if (typeof op.data.parentId === "string") {
          const parent = await tx.issueComment.findFirst({
            where: { id: op.data.parentId, issueId, parentId: null },
            select: { id: true },
          });
          if (!parent) {
            throw new Error(
              "Reply parent must be a top-level comment on the same issue"
            );
          }
          parentId = parent.id;
        }

        // Idempotent — a retried PUT for the same client-generated id just no-ops.
        await tx.issueComment.upsert({
          where: { id: op.id },
          create: { id: op.id, issueId, userId, body, parentId },
          update: {},
        });
        continue;
      }

      if (op.table === "issue_comment_reaction") {
        if (op.op === "DELETE") {
          // Only the reacting user may remove their own reaction.
          const existing = await tx.issueCommentReaction.findFirst({
            where: { id: op.id, userId },
            select: { id: true },
          });
          if (existing) {
            await tx.issueCommentReaction.delete({ where: { id: op.id } });
          }
          continue;
        }

        // PUT — react. `issueId` is looked up server-side from the comment,
        // never trusted from the client, so it can't be spoofed to point at
        // an issue the reactor has no access to.
        const commentId = op.data.commentId;
        const emoji = op.data.emoji;
        if (typeof commentId !== "string" || typeof emoji !== "string") {
          throw new Error("Reaction is missing commentId or emoji");
        }

        const comment = await tx.issueComment.findFirst({
          where: {
            id: commentId,
            issue: {
              team: { organization: { members: { some: { userId } } } },
            },
          },
          select: { id: true, issueId: true },
        });
        if (!comment) {
          throw new Error("Forbidden: no access to comment");
        }

        // Idempotent — a retried PUT (or the same emoji picked twice) just
        // no-ops rather than erroring on the unique constraint.
        await tx.issueCommentReaction.upsert({
          where: {
            commentId_userId_emoji: { commentId, userId, emoji },
          },
          create: {
            id: op.id,
            commentId,
            issueId: comment.issueId,
            userId,
            emoji,
          },
          update: {},
        });
        continue;
      }

      if (op.table !== "issue") continue;

      if (op.op === "DELETE") {
        const existing = await tx.issue.findFirst({
          where: {
            id: op.id,
            team: { organization: { members: { some: { userId } } } },
          },
          select: { id: true },
        });
        if (existing) {
          await tx.issue.delete({ where: { id: op.id } });
        }
        continue;
      }

      if (op.op === "PUT") {
        const teamId = op.data.teamId;
        if (typeof teamId !== "string") {
          throw new Error("Issue insert is missing teamId");
        }

        const team = await tx.team.findFirst({
          where: {
            id: teamId,
            organization: { members: { some: { userId } } },
          },
          select: { id: true },
        });
        if (!team) {
          throw new Error("Forbidden: no access to team");
        }

        await tx.issue.upsert({
          where: { id: op.id },
          create: {
            id: op.id,
            number: (op.data.number as number) ?? 0,
            title: (op.data.title as string) ?? "",
            teamId,
            creatorId: userId,
            stateId: op.data.stateId as string,
            priority: op.data
              .priority as Prisma.IssueUncheckedCreateInput["priority"],
            assigneeId: (op.data.assigneeId as string) ?? null,
            projectId: (op.data.projectId as string) ?? null,
            parentId: (op.data.parentId as string) ?? null,
            cycleId: (op.data.cycleId as string) ?? null,
            description: parseDescription(op.data.description),
          },
          update: toIssueWriteData(op.data),
        });

        // PowerSync only emits a PUT for a locally-created row, so this always
        // represents a genuine creation (a retried PUT would just duplicate the
        // entry, matching the retry semantics the upsert above already has).
        await tx.issueHistory.create({
          data: {
            issueId: op.id,
            actorId: userId,
            field: "created",
            oldValue: null,
            newValue: null,
            createdAt,
          },
        });
        continue;
      }

      // PATCH — verify access via the existing row, then update changed columns.
      const existing = await tx.issue.findFirst({
        where: {
          id: op.id,
          team: { organization: { members: { some: { userId } } } },
        },
        select: {
          id: true,
          title: true,
          stateId: true,
          priority: true,
          assigneeId: true,
          projectId: true,
          parentId: true,
        },
      });
      if (!existing) {
        throw new Error("Forbidden: no access to issue");
      }

      const writeData = toIssueWriteData(op.data);

      await tx.issue.update({
        where: { id: op.id },
        data: writeData,
      });

      const historyDiffs = diffTrackedFields(existing, writeData);
      if (historyDiffs.length > 0) {
        await tx.issueHistory.createMany({
          data: historyDiffs.map((diff) => ({
            issueId: op.id,
            actorId: userId,
            field: diff.field,
            oldValue: diff.oldValue,
            newValue: diff.newValue,
            createdAt,
          })),
        });
      }
    }
  });
}
