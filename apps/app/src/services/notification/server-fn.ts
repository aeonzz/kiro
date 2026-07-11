import authMiddleware from "@/middlewares/auth";
import { createServerFn } from "@tanstack/react-start";

import {
  deleteNotificationSchema,
  getUserNotificationsSchema,
  readNotificationSchema,
  restoreNotificationSchema,
} from "./schema";
import {
  deleteNotificationService,
  getUserNotificationsService,
  readNotificationService,
  restoreNotificationService,
} from "./service";

export const getUserNotificationsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getUserNotificationsSchema)
  .handler(async ({ data }) => {
    return getUserNotificationsService(data);
  });

export const readNotificationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(readNotificationSchema)
  .handler(async ({ data }) => {
    return readNotificationService(data);
  });

export const deleteNotificationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(deleteNotificationSchema)
  .handler(async ({ data }) => {
    return deleteNotificationService(data);
  });

export const restoreNotificationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(restoreNotificationSchema)
  .handler(async ({ data }) => {
    return restoreNotificationService(data);
  });
