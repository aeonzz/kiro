import { IconSvgElement } from "@hugeicons/react";

import { NavItemVisibility } from "@/config/nav";

import { RoutePath } from "./route-type";

export type BadgeStyleOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

export type VisibilityOption = {
  value: string;
  label: string;
};

export type NavItem = {
  title: string;
  url: RoutePath;
  icon: IconSvgElement;
  visibility?: NavItemVisibility;
  disabledVisibilityOptions?: NavItemVisibility[];
};

export type GroupItem = {
  title: string;
  items: NavItem[];
};
