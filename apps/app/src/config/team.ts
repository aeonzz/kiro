import type { TeamIssueTab } from "@/types/team";
import { BacklogIcon, CopyIcon, InProgressIcon } from "@/components/icons";

export const teamIssueTabs: Array<TeamIssueTab> = [
  {
    title: "All issues",
    url: "/$organization/team/$team/all",
    icon: CopyIcon,
  },
  {
    title: "Active",
    url: "/$organization/team/$team/active",
    icon: InProgressIcon,
  },
  {
    title: "Backlog",
    url: "/$organization/team/$team/backlog",
    icon: BacklogIcon,
  },
];
