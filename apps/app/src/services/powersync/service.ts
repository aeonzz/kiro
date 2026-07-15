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
    out.priority = data.priority as Prisma.IssueUncheckedUpdateInput["priority"];
  }
  if (typeof data.stateId === "string") out.stateId = data.stateId;
  if ("assigneeId" in data) out.assigneeId = (data.assigneeId as string) ?? null;
  if ("projectId" in data) out.projectId = (data.projectId as string) ?? null;
  if ("parentId" in data) out.parentId = (data.parentId as string) ?? null;
  if ("cycleId" in data) out.cycleId = (data.cycleId as string) ?? null;

  const description = parseDescription(data.description);
  if (description !== undefined) out.description = description;

  return out;
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
    for (const op of ops) {
      if (op.table === "issue_label_link") {
        if (op.op === "DELETE") {
          await tx.issueLabelLink.deleteMany({
            where: {
              id: op.id,
              issue: {
                team: { organization: { members: { some: { userId } } } },
              },
            },
          });
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

        await tx.issueLabelLink.upsert({
          where: { id: op.id },
          create: { id: op.id, issueId, labelId },
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
            priority:
              op.data
                .priority as Prisma.IssueUncheckedCreateInput["priority"],
            assigneeId: (op.data.assigneeId as string) ?? null,
            projectId: (op.data.projectId as string) ?? null,
            parentId: (op.data.parentId as string) ?? null,
            cycleId: (op.data.cycleId as string) ?? null,
            description: parseDescription(op.data.description),
          },
          update: toIssueWriteData(op.data),
        });
        continue;
      }

      // PATCH — verify access via the existing row, then update changed columns.
      const existing = await tx.issue.findFirst({
        where: {
          id: op.id,
          team: { organization: { members: { some: { userId } } } },
        },
        select: { id: true },
      });
      if (!existing) {
        throw new Error("Forbidden: no access to issue");
      }

      await tx.issue.update({
        where: { id: op.id },
        data: toIssueWriteData(op.data),
      });
    }
  });
}
