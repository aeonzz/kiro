import type { RoutePath } from "./route-type";

export type TeamIssueTab = {
  title: string;
  url: RoutePath;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
};
