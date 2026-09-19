import type * as React from "react";
import { getInitials } from "@/utils/get-initials";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserHoverCard } from "./user-hover-card";

/** An avatar with initials fallback that shows a hover card (name, avatar,
 * email) on hover — used anywhere a user is attributed (activity rows,
 * comments). Pass `withHoverCard={false}` for a self-avatar (e.g. in a
 * composer) where previewing "yourself" doesn't make sense. */
export function UserAvatar({
  avatarUrl,
  label,
  email,
  size = "sm",
  className,
  fallbackClassName,
  withHoverCard = true,
}: {
  avatarUrl?: string;
  label?: string;
  email?: string;
  size?: React.ComponentProps<typeof Avatar>["size"];
  className?: string;
  fallbackClassName?: string;
  withHoverCard?: boolean;
}) {
  const avatar = (
    <Avatar size={size} className={cn("shrink-0", className)}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback className={cn("leading-none", fallbackClassName)}>
        {getInitials(label)}
      </AvatarFallback>
    </Avatar>
  );

  if (!withHoverCard || !label) return avatar;

  return (
    <UserHoverCard user={{ label, avatarUrl, email }}>{avatar}</UserHoverCard>
  );
}
