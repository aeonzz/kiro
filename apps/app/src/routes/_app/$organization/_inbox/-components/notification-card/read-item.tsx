import { InboxUnreadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notificationQueries } from "@/lib/query-factory";
import {
  ContextMenuItem,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";

interface ReadItemProps {
  id: string;
  read: boolean;
}

export function ReadItem({ id, read }: ReadItemProps) {
  const qc = useQueryClient();

  const mutation = useMutation({
    ...notificationQueries.mutations.read(),
  });

  const handleAction = (read: boolean) => {
    mutation.mutate(
      {
        data: {
          id,
          read,
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
  };

  return (
    <ContextMenuItem
      onClick={(e) => {
        e.stopPropagation();
        handleAction(!read);
      }}
    >
      <HugeiconsIcon icon={InboxUnreadIcon} strokeWidth={2} />
      <span> {read ? "Mark as unread" : "Mark as read"}</span>
      <ContextMenuShortcut>U</ContextMenuShortcut>
    </ContextMenuItem>
  );
}
