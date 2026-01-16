import {
  Notification01Icon,
  NotificationOff01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  ContextMenuItem,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";

interface SubscribeItemProps {
  id: string;
  subscribe: boolean;
}

export function SubscribeItem({ id, subscribe }: SubscribeItemProps) {
  return (
    <ContextMenuItem
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <HugeiconsIcon
        icon={subscribe ? NotificationOff01Icon : Notification01Icon}
        strokeWidth={2}
      />
      <span> {subscribe ? "Unsubscribe" : "Subscribe"}</span>
      <ContextMenuShortcut>⇧ S</ContextMenuShortcut>
    </ContextMenuItem>
  );
}
