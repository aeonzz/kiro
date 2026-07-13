import { prisma, type Prisma } from "@kiro/db";

import type { CreateIssue, IssueDraft, UpdateIssue } from "./schema";

/**
 * Returns the current transaction's xid so Electric collections can match the
 * write against the change it later receives over the sync stream. Must be
 * called inside the same transaction as the write.
 */
async function currentTxid(
  tx: Pick<typeof prisma, "$queryRaw">
): Promise<number> {
  const [row] = await tx.$queryRaw<Array<{ txid: string }>>`
    SELECT pg_current_xact_id()::xid::text AS txid
  `;

  return Number(row.txid);
}

export const createIssue = async ({
  userId,
  issue,
}: {
  userId: string;
  issue: CreateIssue;
}) => {
  const team = await prisma.team.findFirst({
    where: {
      id: issue.teamId,
      organizationId: issue.organizationId,
      organization: {
        members: {
          some: { userId },
        },
      },
    },
    select: { id: true },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const workflowState = await prisma.workflowState.findFirst({
    where: {
      id: issue.stateId,
      teamId: issue.teamId,
    },
    select: { id: true },
  });

  if (!workflowState) {
    throw new Error("Status not found");
  }

  const labelIds = [...new Set(issue.labels)];

  if (labelIds.length > 0) {
    const labelCount = await prisma.issueLabel.count({
      where: {
        id: { in: labelIds },
        teamId: issue.teamId,
      },
    });

    if (labelCount !== labelIds.length) {
      throw new Error("Label not found");
    }
  }

  if (issue.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: issue.projectId,
        teamId: issue.teamId,
      },
      select: { id: true },
    });

    if (!project) {
      throw new Error("Project not found");
    }
  }

  const { txid } = await prisma.$transaction(async (tx) => {
    const latestIssue = await tx.issue.findFirst({
      where: { teamId: issue.teamId },
      orderBy: { number: "desc" },
      select: { number: true },
    });

    const number = (latestIssue?.number ?? 0) + 1;

    await tx.issue.create({
      data: {
        ...(issue.id && { id: issue.id }),
        number,
        title: issue.title,
        description: issue.description as Prisma.InputJsonValue,
        priority: issue.priority,
        teamId: issue.teamId,
        creatorId: userId,
        stateId: issue.stateId,
        projectId: issue.projectId || null,
        labels: {
          create: labelIds.map((labelId) => ({
            labelId,
            teamId: issue.teamId,
          })),
        },
      },
    });

    if (issue.draftId) {
      await tx.issueDraft.deleteMany({
        where: {
          id: issue.draftId,
          creatorId: userId,
        },
      });
    }

    return { txid: await currentTxid(tx) };
  });

  return { txid };
};

export const updateIssue = async ({
  userId,
  issue,
}: {
  userId: string;
  issue: UpdateIssue;
}) => {
  const existing = await prisma.issue.findFirst({
    where: {
      id: issue.id,
      team: {
        organization: {
          members: { some: { userId } },
        },
      },
    },
    select: { teamId: true },
  });

  if (!existing) {
    throw new Error("Issue not found");
  }

  if (issue.stateId) {
    const workflowState = await prisma.workflowState.findFirst({
      where: {
        id: issue.stateId,
        teamId: existing.teamId,
      },
      select: { id: true },
    });

    if (!workflowState) {
      throw new Error("Status not found");
    }
  }

  const { txid } = await prisma.$transaction(async (tx) => {
    await tx.issue.update({
      where: { id: issue.id },
      data: {
        ...(issue.stateId && { stateId: issue.stateId }),
        ...(issue.priority && { priority: issue.priority }),
        ...(issue.assigneeId !== undefined && { assigneeId: issue.assigneeId }),
      },
    });

    return { txid: await currentTxid(tx) };
  });

  return { txid };
};

/**
 * Resolves the team a user-owned issue belongs to, throwing if the issue is not
 * visible to the user. Shared by the label-link mutations.
 */
const findOwnedIssueTeam = async (userId: string, issueId: string) => {
  const issue = await prisma.issue.findFirst({
    where: {
      id: issueId,
      team: {
        organization: {
          members: { some: { userId } },
        },
      },
    },
    select: { teamId: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  return issue.teamId;
};

export const addIssueLabel = async ({
  userId,
  issueId,
  labelId,
}: {
  userId: string;
  issueId: string;
  labelId: string;
}) => {
  const teamId = await findOwnedIssueTeam(userId, issueId);

  const label = await prisma.issueLabel.findFirst({
    where: {
      id: labelId,
      teamId,
    },
    select: { id: true },
  });

  if (!label) {
    throw new Error("Label not found");
  }

  return prisma.$transaction(async (tx) => {
    await tx.issueLabelOnIssue.upsert({
      where: { issueId_labelId: { issueId, labelId } },
      create: { issueId, labelId, teamId },
      update: {},
    });

    return { txid: await currentTxid(tx) };
  });
};

export const removeIssueLabel = async ({
  userId,
  issueId,
  labelId,
}: {
  userId: string;
  issueId: string;
  labelId: string;
}) => {
  await findOwnedIssueTeam(userId, issueId);

  return prisma.$transaction(async (tx) => {
    await tx.issueLabelOnIssue.deleteMany({
      where: { issueId, labelId },
    });

    return { txid: await currentTxid(tx) };
  });
};

export const saveIssueDraft = async ({
  userId,
  draft,
}: {
  userId: string;
  draft: IssueDraft;
}) => {
  const { id, description, stateId, ...data } = draft;
  const descriptionString = JSON.stringify(description);

  if (id) {
    return await prisma.issueDraft.update({
      where: { id },
      data: {
        ...data,
        status: stateId,
        description: descriptionString,
        updatedAt: new Date(),
      },
    });
  }

  return await prisma.issueDraft.create({
    data: {
      ...data,
      status: stateId,
      description: descriptionString,
      creatorId: userId,
    },
  });
};

export const getIssueDrafts = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  return await prisma.issueDraft.findMany({
    where: {
      creatorId: userId,
      organizationId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const deleteIssueDraft = async ({
  userId,
  draftId,
}: {
  userId: string;
  draftId: string;
}) => {
  return await prisma.issueDraft.delete({
    where: {
      id: draftId,
      creatorId: userId,
    },
  });
};

export const clearIssueDrafts = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  return await prisma.issueDraft.deleteMany({
    where: {
      creatorId: userId,
      organizationId,
    },
  });
};
