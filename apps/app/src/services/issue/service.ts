import { prisma } from "@kiro/db";

import type { IssueDraft } from "./schema";

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
