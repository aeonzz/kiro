import { createFilterStore } from "@/lib/create-filter-store";
import { createUseFilters } from "@/hooks/use-filters";

export type { FilterOperator } from "@/types/filter";
export type { ActiveFilter as IssueFilter } from "@/types/filter";

export const useIssueFilterStore = createFilterStore("issue-filter-storage");

export const useIssueFilters = createUseFilters(useIssueFilterStore);
