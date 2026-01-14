import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import { notificationActions } from "@/config/inbox";
import { cn, isNavLinkActive } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface NotificationCardProps extends Omit<
  React.ComponentProps<typeof Item>,
  "render" | "onDoubleClick"
> {}

export function NotificationCard({
  className,
  ...props
}: NotificationCardProps) {
  const { organization } = useParams({ from: "/_app/$organization" });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <Item
            className={cn(
              "not-data-active:data-popup-open:bg-muted/50 h-[57px]",
              className
            )}
            size="sm"
            isActive={isNavLinkActive(
              pathname,
              "/$organization/test",
              organization,
              undefined,
              false
            )}
            render={<Link to="/$organization/test" params={{ organization }} />}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => {
              e.stopPropagation();
              navigate({
                to: "/$organization/test",
                params: {
                  organization,
                },
                state: (prev: any) => ({ ...prev, viewMode: "full" }),
              });
            }}
            {...props}
          />
        }
      >
        <ItemMedia className="@max-sm/inbox-panel:hidden">
          <Avatar className="size-9">
            <AvatarImage src="https://github.com/evilrabbit.png" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="text-muted-foreground group-data-active/item:text-foreground w-full truncate">
            <span>ADF-17</span>
            <span className="truncate">ArtPrompted</span>
          </ItemTitle>
          <ItemDescription className="truncate">
            Learn how to get started with our components.
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none self-end text-center">
          <ItemDescription>3mo</ItemDescription>
        </ItemContent>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-fit">
        <ContextMenuGroup>
          {notificationActions.map((action) => {
            if (action.options && action.options.length > 0) {
              return (
                <ContextMenuSub key={action.value}>
                  <ContextMenuSubTrigger shortcut={action.shortcut}>
                    <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                    <span>{action.label}</span>
                  </ContextMenuSubTrigger>
                  <ContextMenuPortal>
                    <ContextMenuSubContent className="min-w-48">
                      {action.options.map((option) => (
                        <ContextMenuItem key={option.value}>
                          <HugeiconsIcon icon={option.icon} strokeWidth={2} />
                          <span>{option.label}</span>
                          {option.shortcut && (
                            <ContextMenuShortcut>
                              {option.shortcut}
                            </ContextMenuShortcut>
                          )}
                        </ContextMenuItem>
                      ))}
                    </ContextMenuSubContent>
                  </ContextMenuPortal>
                </ContextMenuSub>
              );
            }

            return (
              <ContextMenuItem key={action.value}>
                <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                <span>{action.label}</span>
                {action.shortcut && (
                  <ContextMenuShortcut>{action.shortcut}</ContextMenuShortcut>
                )}
              </ContextMenuItem>
            );
          })}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
