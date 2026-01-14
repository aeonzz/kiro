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

export type NotificationActionOption = {
  value: string;
  label: string;
  icon: IconSvgElement;
  shortcut?: string;
};

export type NotificationAction = {
  value: string;
  label: string;
  icon: IconSvgElement;
  shortcut?: string;
  options: NotificationActionOption[];
};
