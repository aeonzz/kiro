import {
  AccessIcon,
  Building02Icon,
  Folder01Icon,
  GridViewIcon,
  InboxIcon,
  Link01Icon,
  Logout01Icon,
  MoreHorizontalIcon,
  NotificationSquareIcon,
  Pen01Icon,
  SecurityIcon,
  Settings01Icon,
  SlidersHorizontalIcon,
  TaskDaily01Icon,
  UserGroupIcon,
  UserIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import { RoutePath } from "@/types/route-type";

type NavItem = {
  title: string;
  url: RoutePath | "action";
  icon: IconSvgElement;
};

type GroupItem = {
  title: string;
  items: NavItem[];
};

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

export const settingsNavItems: GroupItem[] = [
  {
    title: "Account",
    items: [
      {
        title: "Preferences",
        url: "/$organization/settings/account/preferences",
        icon: SlidersHorizontalIcon,
      },
      {
        title: "Profile",
        url: "/$organization/settings/account/profile",
        icon: UserIcon,
      },
      {
        title: "Notifications",
        url: "/$organization/settings/account/notifications",
        icon: NotificationSquareIcon,
      },
      {
        title: "Security and access",
        url: "/$organization/settings/account/security",
        icon: AccessIcon,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Workspace",
        url: "/$organization/settings/administration/workspace",
        icon: Building02Icon,
      },
      {
        title: "Teams",
        url: "/$organization/settings/administration/teams",
        icon: UserSquareIcon,
      },
      {
        title: "Members",
        url: "/$organization/settings/administration/members",
        icon: UserGroupIcon,
      },
      {
        title: "Security",
        url: "/$organization/settings/administration/security",
        icon: SecurityIcon,
      },
    ],
  },
];
