import { Delete04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import { notificationQueries } from "@/lib/query-factory";
import { useDeletedNotificationsStore } from "@/hooks/use-deleted-notifications-store";
import {
  ContextMenuItem,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";

interface DeleteItemProps {
  id: string;
  isActive: boolean;
}

export function DeleteItem({ id, isActive }: DeleteItemProps) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { organization } = useParams({ from: "/_app/$organization" });
  const { addDeletedNotification, removeDeletedNotification } =
    useDeletedNotificationsStore();

  const deleteMutation = useMutation({
    ...notificationQueries.mutations.delete(),
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: notificationQueries.all() });

      const previousNotifications = qc.getQueriesData({
        queryKey: notificationQueries.all(),
      });

      qc.setQueriesData({ queryKey: notificationQueries.all() }, (old: any) => {
        if (!old || !Array.isArray(old)) return old;
        return old.filter((n: any) => n.id !== variables.data.id);
      });

      return { previousNotifications };
    },
    onError: (error, _variables, context) => {
      console.error("Failed to delete:", error);

      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      if (isActive) {
        navigate({
          to: "/$organization/inbox",
          params: {
            organization,
          },
        });
      }

      qc.invalidateQueries({
        queryKey: notificationQueries.all(),
      });
    },
  });

  const handleAction = () => {
    addDeletedNotification(id);

    deleteMutation.mutate(
      {
        data: {
          id: id,
        },
      },
      {
        onError: () => {
          removeDeletedNotification(id);
          toast.error("Failed to delete notification");
        },
      }
    );
  };

  return (
    <ContextMenuItem
      onClick={(e) => {
        e.stopPropagation();
        handleAction();
      }}
    >
      <HugeiconsIcon icon={Delete04Icon} strokeWidth={2} />
      <span>Delete notification</span>
      <ContextMenuShortcut>⌫</ContextMenuShortcut>
    </ContextMenuItem>
  );
}
