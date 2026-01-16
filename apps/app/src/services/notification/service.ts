import { prisma } from "@kiro/db";

import type {
  DeleteNotificationSchemaType,
  GetUserNotificationsSchemaType,
  ReadNotificationSchemaType,
  RestoreNotificationSchemaType,
} from "./schema";

export async function getUserNotificationsService({
  organizationSlug,
  userId,
}: GetUserNotificationsSchemaType) {
  try {
    const organization = await prisma.organization.findUnique({
      where: {
        slug: organizationSlug,
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    return await prisma.notification.findMany({
      where: {
        organization: {
          slug: organizationSlug,
        },
        userId,
        archivedAt: null,
      },
      include: {
        user: true,
        organization: true,
        actor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function readNotificationService({
  id,
  read,
}: ReadNotificationSchemaType) {
  try {
    return await prisma.notification.update({
      where: {
        id,
      },
      data: {
        readAt: read ? new Date() : null,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function deleteNotificationService({
  id,
}: DeleteNotificationSchemaType) {
  try {
    return await prisma.notification.update({
      where: {
        id,
      },
      data: {
        archivedAt: new Date(),
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function restoreNotificationService({
  id,
}: RestoreNotificationSchemaType) {
  try {
    return await prisma.notification.update({
      where: {
        id,
      },
      data: {
        archivedAt: null,
      },
    });
  } catch (err) {
    throw err;
  }
}
