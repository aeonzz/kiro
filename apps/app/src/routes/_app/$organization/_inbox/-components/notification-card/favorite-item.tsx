import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  ContextMenuItem,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";

interface FavoriteItemProps {
  id: string;
  favorite: boolean;
}

export function FavoriteItem({ id, favorite }: FavoriteItemProps) {
  return (
    <ContextMenuItem
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <HugeiconsIcon icon={favorite ? StarIcon : StarIcon} strokeWidth={2} fill="currentColor" />
      <span> {favorite ? "Unfavorite" : "Favorite"}</span>
      <ContextMenuShortcut>Alt F</ContextMenuShortcut>
    </ContextMenuItem>
  );
}
