import * as React from "react";
import { Icon } from "@/utils/icon";
import { User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import type { FilterOption } from "@/types/filter";
import { issueFilterOptions, issueFilterTabs } from "@/config/team";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import {
  GROUP_ID_NO_PROJECT,
  GROUP_ID_UNASSIGNED,
} from "@/hooks/use-grouped-issues";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  useIssueFilterPanelTab,
  useIssuePanelFilters,
} from "@/hooks/use-issue-filter-store";
import { useIssueOptionCounts } from "@/hooks/use-issue-option-counts";
import { useIssueTabKey } from "@/hooks/use-issue-tab-key";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabFilterId: Record<string, string> = {
  assignees: "assignee",
  labels: "label",
  priority: "priority",
  projects: "project",
};

export function FilterTabs() {
  const { team, organization } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const teamId = useTeamId(organization, team);
  const orgMembers = usePowerSyncOrgMembers(organization);
  const teamLabels = usePowerSyncTeamLabels(teamId);
  const teamProjects = usePowerSyncTeamProjects(teamId);
  const counts = useIssueOptionCounts(teamId);
  const tabKey = useIssueTabKey(team);
  const { filters, addFilter, removeFilter, updateFilterValue, clearFilters } =
    useIssuePanelFilters(tabKey);
  const { tab: activeTab, setTab } = useIssueFilterPanelTab(tabKey);
  // The stored tab only exists in the browser, so the server and the hydration
  // render have to agree on the default one first.
  const hydrated = useHydrated();

  const priorityOptions = React.useMemo(
    () =>
      issueFilterOptions.find((option) => option.id === "priority")?.options ??
      [],
    []
  );

  const optionsByTab = React.useMemo<Record<string, FilterOption[]>>(
    () => ({
      // "No assignee"/"No project" lead their lists: they're the bucket every
      // issue starts in, so they're usually the biggest count on the tab.
      assignees: [
        { value: GROUP_ID_UNASSIGNED, label: "No assignee", icon: User02Icon },
        ...orgMembers,
      ],
      labels: teamLabels,
      priority: priorityOptions,
      projects: [
        { value: GROUP_ID_NO_PROJECT, label: "No project" },
        ...teamProjects,
      ],
    }),
    [orgMembers, teamLabels, priorityOptions, teamProjects]
  );

  function toggle(filterId: string, option: FilterOption) {
    const existing = filters.find((filter) => filter.filterId === filterId);
    if (!existing) return addFilter(filterId, option);

    const isOnlyValue =
      existing.options.length === 1 &&
      existing.options[0].value === option.value;
    if (isOnlyValue) removeFilter(existing.id);
    else updateFilterValue(existing.id, option);
  }

  return (
    <Tabs
      value={hydrated ? activeTab : issueFilterTabs[0].value}
      onValueChange={(value) => {
        if (filters.length > 0) clearFilters();
        setTab(value as string);
      }}
    >
      <TabsList className="w-full">
        {issueFilterTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {issueFilterTabs.map((tab) => {
        const filterId = tabFilterId[tab.value];
        const options = optionsByTab[tab.value] ?? [];
        const selected = new Set(
          filters
            .filter((filter) => filter.filterId === filterId)
            .flatMap((filter) => filter.options.map((option) => option.value))
        );

        return (
          <TabsContent key={tab.value} value={tab.value} className="pt-2">
            {options.length === 0 ? (
              <p className="text-muted-foreground px-2 py-6 text-center text-xs">
                No {tab.label.toLowerCase()} in this team yet.
              </p>
            ) : (
              <div className="flex flex-col gap-px">
                {options.map((option) => (
                  <FilterTabRow
                    key={option.value}
                    option={option}
                    count={counts[filterId]?.[option.value] ?? 0}
                    isSelected={selected.has(option.value)}
                    hasSelection={selected.size > 0}
                    // Members have no icon — an avatar (with its own fallback)
                    // stands in. "No assignee" keeps its icon.
                    showAvatar={
                      tab.value === "assignees" &&
                      option.value !== GROUP_ID_UNASSIGNED
                    }
                    onToggle={() => toggle(filterId, option)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function FilterTabRow({
  option,
  count,
  isSelected,
  hasSelection,
  showAvatar,
  onToggle,
}: {
  option: FilterOption;
  count: number;
  isSelected: boolean;
  hasSelection: boolean;
  showAvatar: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={onToggle}
      aria-pressed={isSelected}
      className={cn(
        "group/row w-full justify-start gap-2 px-2 py-1.5 text-left font-normal",
        isSelected && "bg-accent/60"
      )}
    >
      {showAvatar ? (
        <Avatar className="size-4.5!">
          <AvatarImage src={option.avatarUrl} />
          <AvatarFallback>
            <HugeiconsIcon icon={User02Icon} size={12} />
          </AvatarFallback>
        </Avatar>
      ) : option.icon ? (
        <Icon icon={option.icon} color={option.color} />
      ) : (
        <div className="size-4 shrink-0" />
      )}
      <span
        className={cn(
          "text-xs-plus min-w-0 flex-1 truncate",
          hasSelection && !isSelected && "opacity-50"
        )}
      >
        {option.label}
      </span>
      <span className="text-muted-foreground hidden shrink-0 text-xs group-hover/row:block group-focus-visible/row:block">
        {isSelected ? "Clear filter" : "See issues"}
      </span>
      <span className="text-muted-foreground text-xs tabular-nums">
        {count}
      </span>
    </Button>
  );
}
