import {
  AccessIcon,
  Building02Icon,
  CenterFocusIcon,
  CopyIcon,
  Folder01Icon,
  InboxIcon,
  LayerIcon,
  NotificationSquareIcon,
  SecurityIcon,
  Settings01Icon,
  SlidersHorizontalIcon,
  UserGroupIcon,
  UserIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons";

import { GroupItem, NavItem, VisibilityOption } from "@/types/sidebar";

export enum NavItemVisibility {
  Show = "show",
  Hide = "hide",
  Auto = "auto",
}

export const visibilityOptions: VisibilityOption[] = [
  {
    value: "show",
    label: "Always show",
  },
  {
    value: "hide",
    label: "Never show",
  },
  {
    value: "auto",
    label: "Hide in more menu",
  },
];

export const sidebarMenuItems: NavItem[] = [
  {
    title: "Inbox",
    url: "/$organization/inbox",
    icon: InboxIcon,
    disabledVisibilityOptions: [NavItemVisibility.Auto, NavItemVisibility.Hide],
  },
  {
    title: "My Issues",
    url: "/$organization/my-issues/assigned",
    icon: CenterFocusIcon,
    disabledVisibilityOptions: [NavItemVisibility.Auto],
  },
];

export const sidebarTeamItems: NavItem[] = [
  {
    title: "Issues",
    url: "/$organization/team/$team/issues",
    icon: CopyIcon,
  },
  {
    title: "Projects",
    url: "/$organization/team/$team/projects",
    icon: Folder01Icon,
  },
  {
    title: "Views",
    url: "/$organization/team/$team/views",
    icon: LayerIcon,
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
    icon: LayerIcon,
  },
  {
    title: "Members",
    url: "/$organization/members",
    icon: UserGroupIcon,
  },
  {
    title: "Teams",
    url: "/$organization/teams",
    icon: UserSquareIcon,
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
        url: "/$organization/settings/workspace",
        icon: Building02Icon,
      },
      {
        title: "Teams",
        url: "/$organization/settings/teams",
        icon: UserSquareIcon,
      },
      {
        title: "Members",
        url: "/$organization/settings/members",
        icon: UserGroupIcon,
      },
      {
        title: "Security",
        url: "/$organization/settings/security",
        icon: SecurityIcon,
      },
    ],
  },
];
