import type { IconSvgElement } from "@hugeicons/react";

export type FilterOption = {
  value: string;
  label: string;
  icon?: IconSvgElement;
};

export type FilterOptions = {
  id: string;
  label: string;
  multiLabel: string;
  icon: IconSvgElement;
  options: FilterOption[];
};
