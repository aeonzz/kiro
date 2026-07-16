import { createFilterStore } from "@/lib/create-filter-store";
import { createUseFilters } from "@/hooks/use-filters";

export type { FilterOperator } from "@/types/filter";
export type { ActiveFilter as ProjectFilter } from "@/types/filter";

export const useProjectFilterStore = createFilterStore("project-filter-storage");

export const useProjectFilters = createUseFilters(useProjectFilterStore);
