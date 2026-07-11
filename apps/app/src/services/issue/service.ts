import { IssuePriority, prisma, type Prisma } from "@kiro/db";

import type { Issue } from "@/types/issue";

import type { CreateIssue, GetTeamIssues, IssueDraft, UpdateIssue } from "./schema";

function toIssueListItem(issue: {
  id: string;
  number: number;
  title: string;
  priority: IssuePriority;
  state: { type: string };
  assigneeId: string | null;
  labels: Array<{ id: string }>;
  createdAt: Date;
  updatedAt: Date;
}): Issue {
  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    status: issue.state.type as Issue["status"],
    priority: issue.priority,
    createdAt: issue.createdAt.toISOString(),
    updatedAt: issue.updatedAt.toISOString(),
    assigneeId: issue.assigneeId ?? undefined,
    labelIds: issue.labels.map((label) => label.id),
  };
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
      id: issue.status,
      teamId: issue.teamId,
    },
    select: { id: true },
  });

  if (!workflowState) {
    throw new Error("Status not found");
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

  const createdIssue = await prisma.$transaction(async (tx) => {
    const latestIssue = await tx.issue.findFirst({
      where: { teamId: issue.teamId },
      orderBy: { number: "desc" },
      select: { number: true },
    });

    const number = (latestIssue?.number ?? 0) + 1;

    const created = await tx.issue.create({
      data: {
        number,
        title: issue.title,
        description: issue.description as Prisma.InputJsonValue,
        priority: issue.priority,
        teamId: issue.teamId,
        creatorId: userId,
        stateId: issue.status,
        projectId: issue.projectId || null,
        labels: {
          connect: issue.labels.map((id) => ({ id })),
        },
      },
      include: {
        state: true,
        labels: true,
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

    return created;
  });

  return toIssueListItem(createdIssue);
};

export const getTeamIssues = async ({  userId,
  organizationSlug,
  teamSlug,
}: {
  userId: string;
  organizationSlug: GetTeamIssues["organizationSlug"];
  teamSlug: GetTeamIssues["teamSlug"];
}) => {
  const team = await prisma.team.findFirst({
    where: {
      slug: teamSlug,
      organization: {
        slug: organizationSlug,
        members: {
          some: { userId },
        },
      },
    },
    select: { id: true },
  });

  if (!team) {
    return [];
  }

  const issues = await prisma.issue.findMany({
    where: { teamId: team.id },
    orderBy: [{ createdAt: "desc" }, { number: "desc" }],
    include: {
      state: true,
      labels: true,
    },
  });

  return issues.map(toIssueListItem);
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
    select: { id: true },
  });

  if (!existing) {
    throw new Error("Issue not found");
  }

  const updated = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      ...(issue.status && { stateId: issue.status }),
      ...(issue.priority && { priority: issue.priority }),
      ...(issue.assigneeId !== undefined && { assigneeId: issue.assigneeId }),
      ...(issue.labelIds && {
        labels: { set: issue.labelIds.map((id) => ({ id })) },
      }),
    },
    include: {
      state: true,
      labels: true,
    },
  });

  return toIssueListItem(updated);
};

export const saveIssueDraft = async ({
  userId,
  draft,
}: {
  userId: string;
  draft: IssueDraft;
}) => {
  const { id, description, ...data } = draft;
  const descriptionString = JSON.stringify(description);

  if (id) {
    return await prisma.issueDraft.update({
      where: { id },
      data: {
        ...data,
        description: descriptionString,
        updatedAt: new Date(),
      },
    });
  }

  return await prisma.issueDraft.create({
    data: {
      ...data,
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
