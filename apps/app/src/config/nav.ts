import {
  Folder01Icon,
  GridViewIcon,
  InboxIcon,
  Link01Icon,
  Logout01Icon,
  MoreHorizontalIcon,
  Pen01Icon,
  Settings01Icon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import { RoutePath } from "@/types/route-type";

interface NavItem {
  title: string;
  url: RoutePath | "action";
  icon: IconSvgElement;
}

export const sidebarMenuItems: NavItem[] = [
  {
    title: "Inbox",
    url: "/$organization/inbox",
    icon: InboxIcon,
  },
  {
    title: "My Issues",
    url: "/$organization/issues",
    icon: Pen01Icon,
  },
];

export const sidebarTeamItems = [
  {
    title: "Issues",
    url: "/#",
    icon: InboxIcon,
  },
  {
    title: "Projects",
    url: "/#",
    icon: TaskDaily01Icon,
  },
  {
    title: "Views",
    url: "/#",
    icon: GridViewIcon,
  },
];

export const sidebarWorkspaceItems: NavItem[] = [
  {
    title: "Projects",
    url: "/$organization/projects/all",
    icon: Folder01Icon,
  },
  {
    title: "Views",
    url: "/$organization/views/issues",
    icon: GridViewIcon,
  },
  {
    title: "More",
    url: "action",
    icon: MoreHorizontalIcon,
  },
];

export const userMenuMenuItems = [
  {
    title: "Settings",
    url: "/#",
    shortcut: "⌘,",
  },
  {
    title: "Switch workspace",
    url: "/#",
    shortcut: "⌘W",
  },
  {
    title: "Log out",
    url: "/#",
    shortcut: "⌘⇧L",
  },
];

export const sidebarTeamOptions: NavItem[] = [
  {
    title: "Team settings",
    url: "/",
    icon: Settings01Icon,
  },
  {
    title: "Copy link",
    url: "/",
    icon: Link01Icon,
  },
  {
    title: "Leave team",
    url: "/",
    icon: Logout01Icon,
  },
];
