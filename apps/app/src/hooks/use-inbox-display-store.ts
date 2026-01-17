import { create } from "zustand";
import { persist } from "zustand/middleware";

import { orderingOptions } from "@/config/inbox";
import { useOrganization } from "@/components/organization-context";

export type InboxOrdering = (typeof orderingOptions)[number];

export interface InboxDisplayConfig {
  ordering: InboxOrdering["value"];
  showSnoozedItems: boolean;
  showReadItems: boolean;
  showUnreadFirst: boolean;
  showId: boolean;
  showStatusAndIcon: boolean;
}

const DEFAULT_CONFIG: InboxDisplayConfig = {
  ordering: orderingOptions[0].value,
  showSnoozedItems: false,
  showReadItems: true,
  showUnreadFirst: true,
  showId: false,
  showStatusAndIcon: true,
};

interface InboxDisplayState {
  configsByOrg: Record<string, InboxDisplayConfig>;
  setConfig: (orgId: string, config: Partial<InboxDisplayConfig>) => void;
}

export const useInboxDisplayStore = create<InboxDisplayState>()(
  persist(
    (set) => ({
      configsByOrg: {},
      setConfig: (orgId, config) =>
        set((state) => ({
          configsByOrg: {
            ...state.configsByOrg,
            [orgId]: {
              ...(state.configsByOrg[orgId] ?? DEFAULT_CONFIG),
              ...config,
            },
          },
        })),
    }),
    {
      name: "inbox-display-storage",
    }
  )
);

export function useInboxDisplayOptions(orgId?: string) {
  const store = useInboxDisplayStore();
  const config = orgId
    ? (store.configsByOrg[orgId] ?? DEFAULT_CONFIG)
    : DEFAULT_CONFIG;

  return {
    ...config,
    setOrdering: (ordering: InboxOrdering["value"]) =>
      orgId && store.setConfig(orgId, { ordering }),
    setShowSnoozedItems: (showSnoozedItems: boolean) =>
      orgId && store.setConfig(orgId, { showSnoozedItems }),
    setShowReadItems: (showReadItems: boolean) =>
      orgId && store.setConfig(orgId, { showReadItems }),
    setShowUnreadFirst: (showUnreadFirst: boolean) =>
      orgId && store.setConfig(orgId, { showUnreadFirst }),
    setShowId: (showId: boolean) => orgId && store.setConfig(orgId, { showId }),
    setShowStatusAndIcon: (showStatusAndIcon: boolean) =>
      orgId && store.setConfig(orgId, { showStatusAndIcon }),
  };
}

export function useActiveInboxDisplayOptions() {
  const { activeOrganization } = useOrganization();
  return useInboxDisplayOptions(activeOrganization?.id);
}

export function useInboxDisplayConfig(orgId?: string) {
  return useInboxDisplayStore(
    (state) => (orgId ? state.configsByOrg[orgId] : undefined) ?? DEFAULT_CONFIG
  );
}

export function useActiveInboxDisplayConfig() {
  const { activeOrganization } = useOrganization();
  return useInboxDisplayConfig(activeOrganization?.id);
}
