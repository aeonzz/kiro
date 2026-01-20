import * as React from "react";
import { formatDistanceToNowStrict } from "date-fns";

import { NotificationType } from "@/types/enums";
import { Notification } from "@/types/schema-types";
import { issuePriorityMap, issueStatusMap } from "@/config/inbox";
import { cn } from "@/lib/utils";
import { useActiveInboxDisplayConfig } from "@/hooks/use-inbox-display-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface IssueViewProps {
  notification: Notification;
}

export function IssueView({ notification }: IssueViewProps) {
  const { displayProperties } = useActiveInboxDisplayConfig();

  const showId = displayProperties.includes("id");
  const showStatusAndIcon = displayProperties.includes("status-and-icon");

  const read = !!notification.readAt;

  const status =
    issueStatusMap[notification.issueStatus as keyof typeof issueStatusMap];
  const priority =
    issuePriorityMap[
      notification.issuePriority as keyof typeof issuePriorityMap
    ];

  let description = "";

  if (notification.type === NotificationType.STATE_CHANGE) {
    description = `Cancelled by Kiro`;
  } else if (notification.type === NotificationType.ISSUE_CREATED) {
    description = "Created issue";
  } else if (notification.type === NotificationType.ISSUE_ASSIGNED) {
    description = "Assigned to you";
  } else if (notification.type === NotificationType.COMMENT_CREATED) {
    description = "Commented on issue";
  }

  return (
    <React.Fragment>
      <ItemMedia
        variant="image"
        className="self-center! @max-sm/inbox-panel:hidden"
      >
        <Avatar className="size-full">
          <AvatarImage
            src={
              notification.actor && notification.actor.image
                ? notification.actor.image
                : "https://github.com/evilrabbit.png"
            }
          />
          <AvatarFallback className="uppercase">
            {notification.actor
              ? notification.actor.name.charAt(0) +
                notification.actor.name.slice(1, 2)
              : ""}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="text-muted-foreground group-data-active/item:text-foreground group-data-[read=false]/item:text-foreground w-full truncate">
          {!read && (
            <span className="mr-1">
              <div className="bg-primary size-2 rounded-full" />
            </span>
          )}
          {showId && <span className="mr-1">{notification.entityId}</span>}
          <span className="truncate">ArtPrompted</span>
        </ItemTitle>
        <ItemDescription className="truncate group-data-[read=false]/item:text-[color-mix(in_oklab,var(--muted-foreground)90%,var(--foreground))]">
          {description}
        </ItemDescription>
      </ItemContent>
      <ItemContent className="h-full">
        <div
          className={cn(
            "flex flex-1 flex-col items-end",
            showStatusAndIcon ? "justify-between" : "justify-end"
          )}
        >
          {showStatusAndIcon && (
            <status.icon className={cn("size-3.5", status.fillClass)} />
          )}
          <ItemDescription className="text-micro-plus group-data-[read=false]/item:text-[color-mix(in_oklab,var(--muted-foreground)90%,var(--foreground))]">
            {formatDistanceToNowStrict(notification.createdAt)}
          </ItemDescription>
        </div>
      </ItemContent>
    </React.Fragment>
  );
}
