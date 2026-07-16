import { create } from "zustand";
import { persist } from "zustand/middleware";

import { makeFilter, toggleOptionInFilter } from "@/lib/filter";
import type { ActiveFilter, FilterOperator, FilterOption } from "@/types/filter";

export interface FilterStoreState {
  filtersByScope: Record<string, ActiveFilter[]>;
  addFilter: (
    scopeId: string,
    filterId: string,
    option: FilterOption,
    operator?: FilterOperator
  ) => void;
  removeFilter: (scopeId: string, id: string) => void;
  toggleFilter: (
    scopeId: string,
    filterId: string,
    option: FilterOption,
    operator?: FilterOperator
  ) => void;
  updateFilterOperator: (
    scopeId: string,
    id: string,
    operator: FilterOperator
  ) => void;
  toggleFilterValue: (scopeId: string, id: string, option: FilterOption) => void;
  updateFilterValue: (scopeId: string, id: string, option: FilterOption) => void;
  clearFilters: (scopeId: string) => void;
}

function updateScope(
  state: FilterStoreState,
  scopeId: string,
  updater: (filters: ActiveFilter[]) => ActiveFilter[]
): Pick<FilterStoreState, "filtersByScope"> {
  return {
    filtersByScope: {
      ...state.filtersByScope,
      [scopeId]: updater(state.filtersByScope[scopeId] ?? []),
    },
  };
}

export function createFilterStore(storageKey: string) {
  return create<FilterStoreState>()(
    persist(
      (set) => ({
        filtersByScope: {},

        addFilter: (scopeId, filterId, option, operator) =>
          set((state) =>
            updateScope(state, scopeId, (filters) => [
              ...filters,
              makeFilter(filterId, option, operator),
            ])
          ),

        removeFilter: (scopeId, id) =>
          set((state) =>
            updateScope(state, scopeId, (filters) =>
              filters.filter((f) => f.id !== id)
            )
          ),

        toggleFilter: (scopeId, filterId, option, operator) =>
          set((state) =>
            updateScope(state, scopeId, (filters) => {
              const existing = filters.find(
                (f) =>
                  f.filterId === filterId &&
                  f.options.length === 1 &&
                  f.options[0].value === option.value
              );
              if (existing) return filters.filter((f) => f.id !== existing.id);
              return [...filters, makeFilter(filterId, option, operator)];
            })
          ),

        updateFilterOperator: (scopeId, id, operator) =>
          set((state) =>
            updateScope(state, scopeId, (filters) =>
              filters.map((f) => (f.id === id ? { ...f, operator } : f))
            )
          ),

        toggleFilterValue: (scopeId, id, option) =>
          set((state) =>
            updateScope(state, scopeId, (filters) =>
              filters
                .map((f) => {
                  if (f.id !== id) return f;
                  return toggleOptionInFilter(f, option);
                })
                .filter((f): f is ActiveFilter => f !== null)
            )
          ),

        updateFilterValue: (scopeId, id, option) =>
          set((state) =>
            updateScope(state, scopeId, (filters) =>
              filters.map((f) =>
                f.id === id ? { ...f, options: [option] } : f
              )
            )
          ),

        clearFilters: (scopeId) =>
          set((state) =>
            updateScope(state, scopeId, () => [])
          ),
      }),
      { name: storageKey }
    )
  );
}
