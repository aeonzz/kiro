import * as React from "react";
import type { StrictOmit } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";

import type { Notification } from "@/types/schema-types";
import { cn } from "@/lib/utils";
import { useActiveInboxDisplayConfig } from "@/hooks/use-inbox-display-store";
import { ContainerContent } from "@/components/container";

import { NotificationCard } from "./notification-card";
import { NotificationUndoHandler } from "./notification-undo-handler";

interface NotificationListProps extends StrictOmit<
  React.ComponentProps<typeof ContainerContent>,
  "onClick"
> {
  notifications: Notification[];
}

export function NotificationList({
  className,
  notifications,
  ...props
}: NotificationListProps) {
  const { organization } = useParams({ from: "/_app/$organization" });
  const navigate = useNavigate();
  const { ordering, showReadItems, showUnreadFirst, showSnoozedItems } =
    useActiveInboxDisplayConfig();

  const filteredAndSortedNotifications = React.useMemo(() => {
    let result = [...notifications];

    result = result.filter((notification) => {
      const isRead = !!notification.readAt;
      const isSnoozed =
        notification.snoozedUntil &&
        new Date(notification.snoozedUntil) > new Date();

      if (!showReadItems && isRead) return false;

      if (!showSnoozedItems && isSnoozed) return false;

      return true;
    });

    result.sort((a, b) => {
      if (showUnreadFirst) {
        const aUnread = !a.readAt;
        const bUnread = !b.readAt;
        if (aUnread && !bUnread) return -1;
        if (!aUnread && bUnread) return 1;
      }

      if (ordering === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (ordering === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (ordering === "priority") {
        const priorityWeight = {
          URGENT: 4,
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
          NO_PRIORITY: 0,
        };

        const weightA =
          priorityWeight[a.issuePriority as keyof typeof priorityWeight] ?? 0;
        const weightB =
          priorityWeight[b.issuePriority as keyof typeof priorityWeight] ?? 0;

        if (weightA !== weightB) {
          return weightB - weightA;
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [
    notifications,
    ordering,
    showReadItems,
    showUnreadFirst,
    showSnoozedItems,
  ]);

  return (
    <React.Fragment>
      <NotificationUndoHandler />
      <ContainerContent
        className={cn("p-0.5", className)}
        onClick={() => {
          navigate({
            to: "/$organization/inbox",
            params: {
              organization,
            },
          });
        }}
        {...props}
      >
        {filteredAndSortedNotifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </ContainerContent>
    </React.Fragment>
  );
}
