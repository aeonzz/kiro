import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FilterOption } from "@/types/inbox";

export type FilterOperator = "is" | "is not" | "is any of";

export interface InboxFilter {
  id: string;
  filterId: string;
  operator: FilterOperator;
  options: FilterOption[];
}

interface InboxFilterState {
  filtersByOrg: Record<string, InboxFilter[]>;
  addFilter: (
    orgId: string,
    filterId: string,
    option: FilterOption,
    operator?: FilterOperator
  ) => void;
  removeFilter: (orgId: string, id: string) => void;
  toggleFilter: (
    orgId: string,
    filterId: string,
    option: FilterOption,
    operator?: FilterOperator
  ) => void;
  updateFilterOperator: (
    orgId: string,
    id: string,
    operator: FilterOperator
  ) => void;
  toggleFilterValue: (orgId: string, id: string, option: FilterOption) => void;
  updateFilterValue: (orgId: string, id: string, option: FilterOption) => void;
  clearFilters: (orgId: string) => void;
}

export const useInboxFilterStore = create<InboxFilterState>()(
  persist(
    (set) => ({
      filtersByOrg: {},
      addFilter: (orgId, filterId, option, operator = "is") =>
        set((state) => {
          const orgFilters = state.filtersByOrg[orgId] ?? [];
          return {
            filtersByOrg: {
              ...state.filtersByOrg,
              [orgId]: [
                ...orgFilters,
                {
                  id: Math.random().toString(36).substring(2, 9),
                  filterId,
                  options: [option],
                  operator,
                },
              ],
            },
          };
        }),
      removeFilter: (orgId, id) =>
        set((state) => {
          const orgFilters = state.filtersByOrg[orgId] ?? [];
          return {
            filtersByOrg: {
              ...state.filtersByOrg,
              [orgId]: orgFilters.filter((f) => f.id !== id),
            },
          };
        }),
      toggleFilter: (orgId, filterId, option, operator = "is") =>
        set((state) => {
          const orgFilters = state.filtersByOrg[orgId] ?? [];
          const existingFilter = orgFilters.find(
            (f) =>
              f.filterId === filterId &&
              f.options.length === 1 &&
              f.options[0].value === option.value
          );
          if (existingFilter) {
            return {
              filtersByOrg: {
                ...state.filtersByOrg,
                [orgId]: orgFilters.filter((f) => f.id !== existingFilter.id),
              },
            };
          }
          return {
            filtersByOrg: {
              ...state.filtersByOrg,
              [orgId]: [
                ...orgFilters,
                {
                  id: Math.random().toString(36).substring(2, 9),
                  filterId,
                  options: [option],
                  operator,
                },
              ],
            },
          };
        }),
      updateFilterOperator: (orgId, id, operator) =>
        set((state) => {
          const orgFilters = state.filtersByOrg[orgId] ?? [];
          return {
            filtersByOrg: {
              ...state.filtersByOrg,
              [orgId]: orgFilters.map((f) =>
                f.id === id ? { ...f, operator } : f
              ),
            },
          };
        }),
      toggleFilterValue: (orgId, id, option) =>
        set((state) => {
          const orgFilters = state.filtersByOrg[orgId] ?? [];
          return {
            filtersByOrg: {
              ...state.filtersByOrg,
              [orgId]: orgFilters
                .map((f) => {
                  if (f.id !== id) return f;
                  const exists = f.options.find(
                    (o) => o.value === option.value
                  );
                  if (exists) {
                    return {
                      ...f,
                      options: f.options.filter(
                        (o) => o.value !== option.value
                      ),
                    };
                  }
                  return {
                    ...f,
                    options: [...f.options, option],
                  };
                })
                .filter((f) => f.options.length > 0),
            },
          };
        }),
      updateFilterValue: (orgId, id, option) =>
        set((state) => {
          const orgFilters = state.filtersByOrg[orgId] ?? [];
          return {
            filtersByOrg: {
              ...state.filtersByOrg,
              [orgId]: orgFilters.map((f) =>
                f.id === id
                  ? {
                      ...f,
                      options: [option],
                    }
                  : f
              ),
            },
          };
        }),
      clearFilters: (orgId) =>
        set((state) => ({
          filtersByOrg: {
            ...state.filtersByOrg,
            [orgId]: [],
          },
        })),
    }),
    {
      name: "inbox-filter-storage",
    }
  )
);

export function useInboxFilters(orgId?: string) {
  const store = useInboxFilterStore();

  if (!orgId) {
    return {
      filters: [] as InboxFilter[],
      addFilter: () => {},
      removeFilter: () => {},
      toggleFilter: () => {},
      updateFilterOperator: () => {},
      toggleFilterValue: () => {},
      updateFilterValue: () => {},
      clearFilters: () => {},
    };
  }

  return {
    filters: store.filtersByOrg[orgId] ?? [],
    addFilter: (
      filterId: string,
      option: FilterOption,
      operator?: FilterOperator
    ) => store.addFilter(orgId, filterId, option, operator),
    removeFilter: (id: string) => store.removeFilter(orgId, id),
    toggleFilter: (
      filterId: string,
      option: FilterOption,
      operator?: FilterOperator
    ) => store.toggleFilter(orgId, filterId, option, operator),
    updateFilterOperator: (id: string, operator: FilterOperator) =>
      store.updateFilterOperator(orgId, id, operator),
    toggleFilterValue: (id: string, option: FilterOption) =>
      store.toggleFilterValue(orgId, id, option),
    updateFilterValue: (id: string, option: FilterOption) =>
      store.updateFilterValue(orgId, id, option),
    clearFilters: () => store.clearFilters(orgId),
  };
}
