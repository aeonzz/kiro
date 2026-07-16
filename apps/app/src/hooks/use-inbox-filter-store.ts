import { createFilterStore } from "@/lib/create-filter-store";
import { createUseFilters } from "@/hooks/use-filters";

export type { FilterOperator } from "@/types/filter";
export type { ActiveFilter as InboxFilter } from "@/types/filter";

export const useInboxFilterStore = createFilterStore("inbox-filter-storage");

export const useInboxFilters = createUseFilters(useInboxFilterStore);
