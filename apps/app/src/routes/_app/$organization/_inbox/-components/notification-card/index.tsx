import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import type { TypedNotification } from "@/types/inbox";
import type { Notification } from "@/types/schema-types";
import { notificationQueries } from "@/lib/query-factory";
import { cn, isNavLinkActive } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Item } from "@/components/ui/item";

import { CopyItem } from "./copy-item";
import { DeleteItem } from "./delete-item";
import { FavoriteItem } from "./favorite-item";
import { IssueView } from "./issue-view";
import { ReadItem } from "./read-item";
import { SnoozeItem } from "./snooze-item";
import { SubscribeItem } from "./subscribe";

interface NotificationCardProps extends Omit<
  React.ComponentProps<typeof Item>,
  "render" | "onDoubleClick"
> {
  notification: Notification;
}

export function NotificationCard({
  notification,
  className,
  ...props
}: NotificationCardProps) {
  const qc = useQueryClient();
  const { organization } = useParams({ from: "/_app/$organization" });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = isNavLinkActive(
    pathname,
    notification.link,
    organization,
    undefined,
    false
  );

  const mutation = useMutation({
    ...notificationQueries.mutations.read(),
  });

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    mutation.mutate(
      {
        data: {
          id: notification.id,
          read: true,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: notificationQueries.all(),
          });
        },
      }
    );
  }

  function onDoubleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    navigate({
      to: notification.link,
      params: {
        organization,
      },
    });
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <Item
            className={cn(
              "not-data-active:data-popup-open:bg-muted/50 h-[57px]",
              className
            )}
            isActive={isActive}
            data-read={!!notification.readAt}
            render={
              <Link
                to={notification.link}
                params={{ organization }}
                search={{ viewMode: "split" }}
              />
            }
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            {...props}
          />
        }
      >
        <IssueView
          notification={notification as unknown as TypedNotification}
        />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-fit">
        <ContextMenuGroup>
          <ReadItem id={notification.id} read={!!notification.readAt} />
          <DeleteItem id={notification.id} isActive={isActive} />
          <SnoozeItem id={notification.id} />
          <SubscribeItem id={notification.id} subscribe />
          <FavoriteItem id={notification.id} favorite />
          <CopyItem id={notification.id} />
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
