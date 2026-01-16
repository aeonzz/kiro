import { prisma } from "@kiro/db";
// We import the backend-safe Notification type from Prisma directly here
// since this is a server utility
import type { EntityType, Prisma } from "@kiro/db";

import type { NotificationType } from "@/types/enums";

// Define input type reusing Prisma's defined types for enum safety
// but we use our re-declared enums or raw strings for flexibility if needed,
// though strictly we should match Prisma's input.
interface SendNotificationInput {
  organizationId: string;
  userId: string;
  actorId?: string;
  type: NotificationType;
  entityId: string;
  entityType: EntityType;
  link?: string;
  data?: Prisma.InputJsonValue;
}

/**
 * Sends a notification with aggregation logic.
 * If a notification for the same entity and user already exists, it "bumps" it
 * (marks as unread, updates timestamp & content) instead of creating a new one.
 */
export async function sendNotification({
  organizationId,
  userId,
  actorId,
  type,
  entityId,
  entityType,
  link,
  data,
}: SendNotificationInput) {
  // 1. Check for existing notification for this specific entitycontext
  const existingNotification = await prisma.notification.findFirst({
    where: {
      userId,
      entityId,
      entityType,
      // We generally only aggregate notifications within the same organization
      // though userId + entityId should be unique enough.
      organizationId,
      // Optional: You might only want to aggregate if it's not archived
      // archivedAt: null,
    },
  });

  if (existingNotification) {
    // 2. Update existing (Bump)
    return await prisma.notification.update({
      where: {
        id: existingNotification.id,
      },
      data: {
        readAt: null, // Mark as unread
        snoozedUntil: null, // Un-snooze if it was snoozed
        archivedAt: null, // Restore if archived (optional, depends on preference)
        updatedAt: new Date(), // Bump timestamp
        type, // Update to the latest event type (e.g. ISSUE_CREATED -> COMMENT_CREATED)
        actorId, // Update who triggered the latest change
        data, // Update payload
        // link is usually constant for an entity, but we can update it just in case
        ...(link ? { link } : {}),
      },
    });
  } else {
    // 3. Create new
    return await prisma.notification.create({
      data: {
        organizationId,
        userId,
        actorId,
        type,
        entityId,
        entityType,
        link: link || "", // Ensure link is present since we made it required
        data,
      },
    });
  }
}
