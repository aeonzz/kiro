import {
  Clock01Icon,
  NotificationSnoozeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";

const options = [
  {
    value: "hour",
    label: "An hour from now",
    icon: Clock01Icon,
  },
  {
    value: "tomorrow",
    label: "Tomorrow",
    icon: Clock01Icon,
  },
  {
    value: "next-week",
    label: "Next week",
    icon: Clock01Icon,
  },
  {
    value: "month",
    label: "A month from now",
    icon: Clock01Icon,
  },
];

interface SnoozeItemProps {
  id: string;
}

export function SnoozeItem({ id }: SnoozeItemProps) {
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger shortcut="H" onClick={(e) => e.stopPropagation()}>
        <HugeiconsIcon icon={NotificationSnoozeIcon} strokeWidth={2} />
        <span>Snooze</span>
      </ContextMenuSubTrigger>
      <ContextMenuPortal>
        <ContextMenuSubContent className="min-w-48">
          {options.map((option) => (
            <ContextMenuItem
              key={option.value}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <HugeiconsIcon icon={option.icon} strokeWidth={2} />
              <span>{option.label}</span>
            </ContextMenuItem>
          ))}
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </ContextMenuSub>
  );
}
