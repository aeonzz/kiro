import * as React from "react";
import type { StrictOmit } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";

import type { Notification } from "@/types/schema-types";
import { cn } from "@/lib/utils";
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
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </ContainerContent>
    </React.Fragment>
  );
}
