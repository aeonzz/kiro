import * as React from "react";
import { MOCK_USERS } from "@/mocks/users";
import type { StrictOmit } from "@/types";
import { Icon } from "@/utils/icon";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  CommandIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import type { IconType } from "@/types/inbox";
import type { Issue } from "@/types/issue";
import { issueFilterOptions } from "@/config/team";
import { cn } from "@/lib/utils";
import { useActiveIssueDisplayOptions } from "@/hooks/use-issue-display-store";
import { useIssueStore } from "@/hooks/use-issue-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ListBox } from "@/components/ui/list-box";
import {
  ActionBar,
  ActionBarClose,
  ActionBarContent,
  ActionBarSeparator,
} from "@/components/action-bar";

import { IssueListItem } from "./issue-list-item";

interface IssueListProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {}

export function IssueList({ className, ...props }: IssueListProps) {
  const { issues } = useIssueStore();
  const { team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const { grouping } = useActiveIssueDisplayOptions(team);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const { groupedIssues, flattenedIssues } = React.useMemo(() => {
    if (!grouping || grouping === "none") {
      return {
        groupedIssues: [
          { id: "none", label: "All issues", issues, color: "var(--muted)" },
        ],
        flattenedIssues: issues,
      };
    }

    const groups: Record<
      string,
      {
        label: string;
        icon?: IconType | string;
        color: string;
        issues: Array<Issue>;
      }
    > = {};

    if (grouping === "status") {
      const statusOptions =
        issueFilterOptions.find((o) => o.id === "status")?.options ?? [];

      statusOptions.forEach((opt) => {
        groups[opt.value] = {
          label: opt.label,
          icon: opt.icon,
          color: opt.color || "var(--muted-foreground)",
          issues: [],
        };
      });

      issues.forEach((issue) => {
        if (groups[issue.status]) {
          groups[issue.status].issues.push(issue);
        }
      });
    } else if (grouping === "priority") {
      const priorityOptions =
        issueFilterOptions.find((o) => o.id === "priority")?.options ?? [];
      priorityOptions.forEach((opt) => {
        groups[opt.value] = {
          label: opt.label,
          icon: opt.icon,
          color: "var(--muted-foreground)",
          issues: [],
        };
      });

      issues.forEach((issue) => {
        if (groups[issue.priority]) {
          groups[issue.priority].issues.push(issue);
        }
      });
    } else if (grouping === "assignee") {
      groups["unassigned"] = {
        label: "No assignee",
        icon: User02Icon,
        color: "var(--muted-foreground)",
        issues: [],
      };

      MOCK_USERS.forEach((user) => {
        groups[user.id] = {
          label: user.name,
          icon: user.avatarUrl,
          color: "var(--muted-foreground)",
          issues: [],
        };
      });

      issues.forEach((issue) => {
        const id = issue.assigneeId || "unassigned";
        if (groups[id]) {
          groups[id].issues.push(issue);
        }
      });
    }

    const filteredGroups = Object.entries(groups)
      .filter(([_, group]) => group.issues.length > 0)
      .map(([id, group]) => ({
        id,
        ...group,
      }));

    return {
      groupedIssues: filteredGroups,
      flattenedIssues: filteredGroups.flatMap((g) => g.issues),
    };
  }, [issues, grouping]);

  let cumulativeIndex = 0;

  return (
    <div
      ref={setContainer}
      className={cn("relative h-full min-w-0 flex-1", className)}
    >
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="h-full" {...props}>
          <ListBox items={flattenedIssues}>
            {groupedIssues.map((group, index) => (
              <Collapsible key={group.id} defaultOpen>
                {grouping !== "none" && (
                  <CollapsibleTrigger
                    style={
                      {
                        "--bg-color": group.color,
                      } as React.CSSProperties
                    }
                    className={cn(
                      "group/trigger border-border/50 before:from-muted-foreground/2 relative h-9 w-full border-b outline-none before:absolute before:inset-0 before:bg-linear-to-l before:to-transparent before:content-['']",
                      "to-muted-foreground/2 bg-linear-to-r from-(--bg-color)/5"
                    )}
                  >
                    {(() => {
                      const selectedCount = group.issues.filter((i) =>
                        selectedIds.has(i.id)
                      ).length;
                      return (
                        <div className="flex items-center gap-2.5 px-2 py-2">
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            className="text-muted-foreground size-3.5 transition-transform duration-200 group-data-panel-open/trigger:rotate-90"
                          />
                          {group.icon &&
                            (typeof group.icon === "string" ? (
                              <Avatar className="size-4.5!">
                                <AvatarImage src={group.icon} />
                                <AvatarFallback>
                                  <HugeiconsIcon icon={User02Icon} size={12} />
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <Icon
                                icon={group.icon}
                                className="text-muted-foreground size-4"
                                color={group.color}
                              />
                            ))}
                          <span className="text-xs-plus text-foreground font-normal">
                            {group.label}
                          </span>
                          <span className="text-muted-foreground text-xs-plus leading-none tabular-nums">
                            {group.issues.length}
                          </span>
                          {selectedCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs-plus rounded-sm px-1 py-0.5 leading-none tabular-nums opacity-100 group-data-panel-open/trigger:opacity-0">
                              {selectedCount}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </CollapsibleTrigger>
                )}
                <CollapsibleContent>
                  <div
                    className={cn(
                      "border-border/50 flex flex-col border-b",
                      index === groupedIssues.length - 1 && "border-b-0!"
                    )}
                  >
                    {group.issues.map((issue) => {
                      const index = cumulativeIndex++;
                      const isSelected = selectedIds.has(issue.id);
                      return (
                        <IssueListItem
                          key={issue.id}
                          index={index}
                          isSelected={isSelected}
                          toggleId={toggleId}
                          issue={issue}
                        />
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </ListBox>
        </div>
        <ActionBar
          open={selectedIds.size > 0}
          onOpenChange={(open) => !open && setSelectedIds(new Set())}
        >
          <ActionBarContent container={container}>
            <ButtonGroup className="*:data-[slot=button]:border-foreground/15 shadow-sm *:data-[slot=button]:border *:data-[slot=button]:border-dashed *:data-[slot=button]:shadow-none">
              <Button variant="ghost" size="sm" className="tabular-nums">
                {selectedIds.size} selected
              </Button>
              <ActionBarClose />
            </ButtonGroup>
            <ActionBarSeparator />
            <Button variant="secondary" size="sm">
              <HugeiconsIcon icon={CommandIcon} strokeWidth={2} />
              Actions
            </Button>
          </ActionBarContent>
        </ActionBar>
      </div>
    </div>
  );
}
