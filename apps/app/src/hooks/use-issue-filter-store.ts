import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FilterOption } from "@/types/inbox";

export type FilterOperator = "is" | "is not" | "is any of";

export interface IssueFilter {
  id: string;
  filterId: string;
  operator: FilterOperator;
  options: FilterOption[];
}

interface IssueFilterState {
  filtersByTeam: Record<string, IssueFilter[]>;
  addFilter: (
    teamId: string,
    filterId: string,
    option: FilterOption,
    operator?: FilterOperator
  ) => void;
  removeFilter: (teamId: string, id: string) => void;
  toggleFilter: (
    teamId: string,
    filterId: string,
    option: FilterOption,
    operator?: FilterOperator
  ) => void;
  updateFilterOperator: (
    teamId: string,
    id: string,
    operator: FilterOperator
  ) => void;
  toggleFilterValue: (teamId: string, id: string, option: FilterOption) => void;
  updateFilterValue: (teamId: string, id: string, option: FilterOption) => void;
  clearFilters: (teamId: string) => void;
}

export const useIssueFilterStore = create<IssueFilterState>()(
  persist(
    (set) => ({
      filtersByTeam: {},
      addFilter: (teamId, filterId, option, operator = "is") =>
        set((state) => {
          const teamFilters = state.filtersByTeam[teamId] ?? [];
          return {
            filtersByTeam: {
              ...state.filtersByTeam,
              [teamId]: [
                ...teamFilters,
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
      removeFilter: (teamId, id) =>
        set((state) => {
          const teamFilters = state.filtersByTeam[teamId] ?? [];
          return {
            filtersByTeam: {
              ...state.filtersByTeam,
              [teamId]: teamFilters.filter((f) => f.id !== id),
            },
          };
        }),
      toggleFilter: (teamId, filterId, option, operator = "is") =>
        set((state) => {
          const teamFilters = state.filtersByTeam[teamId] ?? [];
          const existingFilter = teamFilters.find(
            (f) =>
              f.filterId === filterId &&
              f.options.length === 1 &&
              f.options[0].value === option.value
          );
          if (existingFilter) {
            return {
              filtersByTeam: {
                ...state.filtersByTeam,
                [teamId]: teamFilters.filter((f) => f.id !== existingFilter.id),
              },
            };
          }
          return {
            filtersByTeam: {
              ...state.filtersByTeam,
              [teamId]: [
                ...teamFilters,
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
      updateFilterOperator: (teamId, id, operator) =>
        set((state) => {
          const teamFilters = state.filtersByTeam[teamId] ?? [];
          return {
            filtersByTeam: {
              ...state.filtersByTeam,
              [teamId]: teamFilters.map((f) =>
                f.id === id ? { ...f, operator } : f
              ),
            },
          };
        }),
      toggleFilterValue: (teamId, id, option) =>
        set((state) => {
          const teamFilters = state.filtersByTeam[teamId] ?? [];
          return {
            filtersByTeam: {
              ...state.filtersByTeam,
              [teamId]: teamFilters
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
      updateFilterValue: (teamId, id, option) =>
        set((state) => {
          const teamFilters = state.filtersByTeam[teamId] ?? [];
          return {
            filtersByTeam: {
              ...state.filtersByTeam,
              [teamId]: teamFilters.map((f) =>
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
      clearFilters: (teamId) =>
        set((state) => ({
          filtersByTeam: {
            ...state.filtersByTeam,
            [teamId]: [],
          },
        })),
    }),
    {
      name: "issue-filter-storage",
    }
  )
);

export function useIssueFilters(teamId?: string) {
  const store = useIssueFilterStore();

  if (!teamId) {
    return {
      filters: [] as IssueFilter[],
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
    filters: store.filtersByTeam[teamId] ?? [],
    addFilter: (
      filterId: string,
      option: FilterOption,
      operator?: FilterOperator
    ) => store.addFilter(teamId, filterId, option, operator),
    removeFilter: (id: string) => store.removeFilter(teamId, id),
    toggleFilter: (
      filterId: string,
      option: FilterOption,
      operator?: FilterOperator
    ) => store.toggleFilter(teamId, filterId, option, operator),
    updateFilterOperator: (id: string, operator: FilterOperator) =>
      store.updateFilterOperator(teamId, id, operator),
    toggleFilterValue: (id: string, option: FilterOption) =>
      store.toggleFilterValue(teamId, id, option),
    updateFilterValue: (id: string, option: FilterOption) =>
      store.updateFilterValue(teamId, id, option),
    clearFilters: () => store.clearFilters(teamId),
  };
}
