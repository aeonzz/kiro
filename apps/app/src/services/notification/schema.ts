import * as z from "zod";

export const getUserNotificationsSchema = z.object({
  organizationSlug: z.string(),
  userId: z.string(),
});

export type GetUserNotificationsSchemaType = z.infer<
  typeof getUserNotificationsSchema
>;

export const readNotificationSchema = z.object({
  id: z.string(),
  read: z.boolean(),
});

export type ReadNotificationSchemaType = z.infer<typeof readNotificationSchema>;

export const deleteNotificationSchema = z.object({
  id: z.string(),
});

export type DeleteNotificationSchemaType = z.infer<
  typeof deleteNotificationSchema
>;

export const restoreNotificationSchema = z.object({
  id: z.string(),
});

export type RestoreNotificationSchemaType = z.infer<
  typeof restoreNotificationSchema
>;
