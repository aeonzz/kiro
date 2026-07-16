import type { createFilterStore } from "@/lib/create-filter-store";
import type { ActiveFilter, FilterOperator, FilterOption } from "@/types/filter";

const noop = () => {};

const emptyFilters = {
  filters: [] as ActiveFilter[],
  addFilter: noop as (filterId: string, option: FilterOption, operator?: FilterOperator) => void,
  removeFilter: noop as (id: string) => void,
  toggleFilter: noop as (filterId: string, option: FilterOption, operator?: FilterOperator) => void,
  updateFilterOperator: noop as (id: string, operator: FilterOperator) => void,
  toggleFilterValue: noop as (id: string, option: FilterOption) => void,
  updateFilterValue: noop as (id: string, option: FilterOption) => void,
  clearFilters: noop as () => void,
};

export function createUseFilters(store: ReturnType<typeof createFilterStore>) {
  return function useFilters(scopeId?: string) {
    const s = store();

    if (!scopeId) return emptyFilters;

    return {
      filters: s.filtersByScope[scopeId] ?? [],
      addFilter: (filterId: string, option: FilterOption, operator?: FilterOperator) =>
        s.addFilter(scopeId, filterId, option, operator),
      removeFilter: (id: string) => s.removeFilter(scopeId, id),
      toggleFilter: (filterId: string, option: FilterOption, operator?: FilterOperator) =>
        s.toggleFilter(scopeId, filterId, option, operator),
      updateFilterOperator: (id: string, operator: FilterOperator) =>
        s.updateFilterOperator(scopeId, id, operator),
      toggleFilterValue: (id: string, option: FilterOption) =>
        s.toggleFilterValue(scopeId, id, option),
      updateFilterValue: (id: string, option: FilterOption) =>
        s.updateFilterValue(scopeId, id, option),
      clearFilters: () => s.clearFilters(scopeId),
    };
  };
}
