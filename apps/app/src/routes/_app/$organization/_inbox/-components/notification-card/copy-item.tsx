import {
  Clipboard,
  CopyIcon,
  Link04Icon,
  TextIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";

const options = [
  {
    value: "id",
    label: "Copy ID",
    icon: CopyIcon,
    shortcut: "ctrl .",
  },
  {
    value: "url",
    label: "Copy URL",
    icon: Link04Icon,
    shortcut: "ctrl ⇧ ,",
  },
  {
    value: "title",
    label: "Copy title",
    icon: TextIcon,
    shortcut: "ctrl ⇧ '",
  },
];

interface CopyItemProps {
  id: string;
}

export function CopyItem({ id }: CopyItemProps) {
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger onClick={(e) => e.stopPropagation()}>
        <HugeiconsIcon icon={Clipboard} strokeWidth={2} />
        <span>Copy</span>
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
              <ContextMenuShortcut>{option.shortcut}</ContextMenuShortcut>
            </ContextMenuItem>
          ))}
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </ContextMenuSub>
  );
}
