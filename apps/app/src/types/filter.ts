import type { IconType } from "@/types/icon";

export type FilterOperator = "is" | "is not" | "is any of";

export type FilterOption = {
  value: string;
  label: string;
  icon?: IconType;
  color?: string;
  avatarUrl?: string;
};

export type FilterConfig = {
  id: string;
  label: string;
  multiLabel: string;
  multiIcon?: boolean;
  icon: IconType;
  options: FilterOption[];
};

export type ActiveFilter = {
  id: string;
  filterId: string;
  operator: FilterOperator;
  options: FilterOption[];
};
