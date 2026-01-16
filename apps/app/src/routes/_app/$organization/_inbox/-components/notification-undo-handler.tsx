import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { notificationQueries } from "@/lib/query-factory";
import { useDeletedNotificationsStore } from "@/hooks/use-deleted-notifications-store";

export function NotificationUndoHandler() {
  const qc = useQueryClient();
  const { deletedNotifications, removeDeletedNotification } =
    useDeletedNotificationsStore();
  const processedIds = React.useRef(new Set<string>());

  const restoreMutation = useMutation({
    ...notificationQueries.mutations.restore(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: notificationQueries.all() });

      const previousNotifications = qc.getQueriesData({
        queryKey: notificationQueries.all(),
      });

      return { previousNotifications };
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: notificationQueries.all(),
      });
    },
    onError: (error: any, _variables: any, context: any) => {
      console.error("Failed to restore:", error);

      if (context?.previousNotifications) {
        context.previousNotifications.forEach(
          ([queryKey, data]: [any, any]) => {
            qc.setQueryData(queryKey, data);
          }
        );
      }
    },
  });

  React.useEffect(() => {
    deletedNotifications.forEach((_, id) => {
      if (processedIds.current.has(id)) {
        return;
      }

      processedIds.current.add(id);

      toast.success("Notification deleted", {
        id: `delete-${id}`,
        action: {
          label: "Undo",
          onClick: () => {
            restoreMutation.mutate(
              {
                data: {
                  id,
                },
              },
              {
                onSuccess: () => {
                  removeDeletedNotification(id);
                  toast.dismiss(`delete-${id}`);
                  toast.success("Notification restored");
                  processedIds.current.delete(id);
                },
                onError: () => {
                  toast.error("Failed to restore notification");
                },
              }
            );
          },
        },
        duration: 5000,
        onDismiss: () => {
          setTimeout(() => {
            processedIds.current.delete(id);
          }, 100);
        },
        onAutoClose: () => {
          processedIds.current.delete(id);
        },
      });
    });
  }, [deletedNotifications, qc, removeDeletedNotification, restoreMutation]);

  return null;
}
