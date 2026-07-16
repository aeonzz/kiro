import type { ActiveFilter, FilterOperator, FilterOption } from "@/types/filter";

export type FieldAccessor<T> = (item: T) => string | string[] | null | undefined;

function matchesOperator(
  itemValues: string[],
  selectedValues: string[],
  operator: FilterOperator
): boolean {
  if (selectedValues.length === 0) return true;
  const hasMatch = itemValues.some((v) => selectedValues.includes(v));
  if (operator === "is not") return !hasMatch;
  return hasMatch;
}

export function applyFilters<T>(
  items: T[],
  filters: ActiveFilter[],
  fieldMap: Record<string, FieldAccessor<T>>
): T[] {
  if (filters.length === 0) return items;

  return items.filter((item) =>
    filters.every((filter) => {
      const accessor = fieldMap[filter.filterId];
      if (!accessor) return true;

      const raw = accessor(item);
      const itemValues = Array.isArray(raw)
        ? raw.filter(Boolean)
        : raw != null
          ? [raw]
          : [];

      const selectedValues = filter.options.map((o) => o.value);
      return matchesOperator(itemValues, selectedValues, filter.operator);
    })
  );
}

const DATE_BUCKETS: Array<{ value: string; days: number }> = [
  { value: "1d", days: 1 },
  { value: "3d", days: 3 },
  { value: "1w", days: 7 },
  { value: "1m", days: 30 },
  { value: "3m", days: 90 },
  { value: "6m", days: 180 },
  { value: "1y", days: 365 },
];

/** Returns every date-range bucket key the given date falls into (e.g. "within the last 3 days"). */
export function getDateBuckets(dateStr: string | null | undefined): string[] {
  if (!dateStr) return [];
  const diffDays = (Date.now() - new Date(dateStr).getTime()) / 86_400_000;
  if (isNaN(diffDays) || diffDays < 0) return [];
  return DATE_BUCKETS.filter((b) => diffDays <= b.days).map((b) => b.value);
}

export function makeFilter(
  filterId: string,
  option: FilterOption,
  operator: FilterOperator = "is"
): ActiveFilter {
  return {
    id: Math.random().toString(36).substring(2, 9),
    filterId,
    operator,
    options: [option],
  };
}

export function toggleOptionInFilter(
  filter: ActiveFilter,
  option: FilterOption
): ActiveFilter | null {
  const exists = filter.options.some((o) => o.value === option.value);
  if (exists) {
    const next = filter.options.filter((o) => o.value !== option.value);
    return next.length === 0 ? null : { ...filter, options: next };
  }
  return { ...filter, options: [...filter.options, option] };
}
