import type { FontSizeOptions, HomeViewOptions } from "@/types/preferences";

export enum FontSizeValue {
  XS = "xs",
  SM = "sm",
  DEFAULT = "default",
  LG = "lg",
  XL = "xl",
}

export enum HomeViewValue {
  ASSIGNED_ISSUES = "assigned-issues",
  INBOX = "inbox",
  PROJECTS = "projects",
}

export const fontSizes: FontSizeOptions[] = [
  { value: FontSizeValue.XS, label: "Smaller" },
  { value: FontSizeValue.SM, label: "Small" },
  { value: FontSizeValue.DEFAULT, label: "Default" },
  { value: FontSizeValue.LG, label: "Large" },
  { value: FontSizeValue.XL, label: "Larger" },
];

export const homeViewOptions: HomeViewOptions[] = [
  { value: HomeViewValue.ASSIGNED_ISSUES, label: "My issues" },
  { value: HomeViewValue.INBOX, label: "Inbox" },
  { value: HomeViewValue.PROJECTS, label: "Projects" },
];
