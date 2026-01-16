import { create } from "zustand";

interface DeletedNotification {
  id: string;
  deletedAt: number;
}

interface DeletedNotificationsStore {
  deletedNotifications: Map<string, DeletedNotification>;
  addDeletedNotification: (id: string) => void;
  removeDeletedNotification: (id: string) => void;
  clearOldDeleted: () => void;
}

export const useDeletedNotificationsStore = create<DeletedNotificationsStore>(
  (set) => ({
    deletedNotifications: new Map(),

    addDeletedNotification: (id: string) => {
      set((state) => {
        const newMap = new Map(state.deletedNotifications);
        newMap.set(id, { id, deletedAt: Date.now() });
        return { deletedNotifications: newMap };
      });

      setTimeout(() => {
        set((state) => {
          const newMap = new Map(state.deletedNotifications);
          newMap.delete(id);
          return { deletedNotifications: newMap };
        });
      }, 10000);
    },

    removeDeletedNotification: (id: string) => {
      set((state) => {
        const newMap = new Map(state.deletedNotifications);
        newMap.delete(id);
        return { deletedNotifications: newMap };
      });
    },

    clearOldDeleted: () => {
      set((state) => {
        const newMap = new Map(state.deletedNotifications);
        const now = Date.now();
        const tenSecondsAgo = now - 10000;

        for (const [id, notification] of newMap.entries()) {
          if (notification.deletedAt < tenSecondsAgo) {
            newMap.delete(id);
          }
        }

        return { deletedNotifications: newMap };
      });
    },
  })
);
