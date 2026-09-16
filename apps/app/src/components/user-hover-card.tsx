import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type UserHoverCardUser = {
  label: string;
  avatarUrl?: string;
  email?: string;
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Wraps `children` (a name, avatar, mention — anything identifying a user)
 * with a hover card showing that user's avatar, name, and email. */
export function UserHoverCard({
  user,
  children,
}: {
  user: UserHoverCardUser;
  children: React.ReactNode;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger render={<span className="shrink-0 cursor-default" />}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-64" side="top" align="start">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{getInitials(user.label)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{user.label}</span>
            {user.email && (
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
