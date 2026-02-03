import * as React from "react";
import { issueLabelOptions } from "@/config";
import { MOCK_USERS } from "@/mocks/users";
import { formatDate } from "@/utils/format-date";
import { Icon } from "@/utils/icon";
import {
  EditUser02Icon,
  FullSignalIcon,
  LabelIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "@tanstack/react-router";
import { format } from "date-fns";

import type { Issue } from "@/types/issue";
import { issueFilterOptions } from "@/config/team";
import { cn } from "@/lib/utils";
import { useActiveIssueDisplayOptions } from "@/hooks/use-issue-display-store";
import { useIssueStore } from "@/hooks/use-issue-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ListBoxItem } from "@/components/ui/list-box";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InProgressIcon } from "@/components/icons";
import { ItemsCombobox } from "@/components/items-combobox";

import { LabelCombobox } from "./label-combobox";

interface IssueListItemProps {
  issue: Issue;
  index: number;
  isSelected: boolean;
  toggleId: (id: string) => void;
}

export function IssueListItem({
  isSelected,
  index,
  toggleId,
  issue,
}: IssueListItemProps) {
  const updateIssue = useIssueStore((state) => state.updateIssue);

  const { organization, team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });

  const {
    grouping,
    ordering,
    direction,
    completedIssues,
    showSubIssues,
    showEmptyGroups,
    displayProperties,
  } = useActiveIssueDisplayOptions(team);

  const handleUpdateIssue = (updates: Partial<Issue>) => {
    updateIssue(issue.id, updates);
  };

  const priorityOptions =
    issueFilterOptions.find((option) => option.id === "priority")?.options ??
    [];

  const statusOptions =
    issueFilterOptions.find((option) => option.id === "status")?.options ?? [];

  const issueLabels = React.useMemo(
    () =>
      issueLabelOptions.filter((option) =>
        issue?.labelIds?.includes(option.value)
      ),
    [issue?.labelIds]
  );

  const assigneesOptions = [
    {
      value: "unassigned",
      label: "No assignee",
      icon: User02Icon,
      color: "text-muted-foreground",
    },
    ...MOCK_USERS.map((user) => ({
      value: user.id,
      label: user.name,
      avatarUrl: user.avatarUrl,
    })),
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <ListBoxItem
            index={index}
            isSelected={isSelected}
            className={cn(
              "data-active:not-data-selected:bg-muted dark:data-active:not-data-selected:bg-muted/50 data-active:text-foreground data-[kb-visible=true]:ring-ring/50 [&_svg]:text-muted-foreground data-selected:bg-muted dark:not-data-selected:data-popup-open:bg-muted/50 not-data-selected:data-popup-open:bg-muted flex h-11 items-center gap-2 px-2 py-1.5 text-sm outline-none select-none data-[kb-visible=true]:ring-1 data-[kb-visible=true]:ring-inset [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            )}
            render={
              <Link
                to="/$organization/issue/$id"
                params={{ organization, id: issue.id }}
                state={(prev: any) => ({ ...prev, viewMode: "full" })}
              />
            }
          />
        }
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center"
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleId(issue.id)}
                  tabIndex={-1}
                  className={cn(
                    "size-3.5 opacity-0 group-data-active/list-box-item:opacity-100 group-data-popup-open/list-box-item:opacity-100",
                    isSelected && "opacity-100"
                  )}
                />
              }
            />
            <TooltipContent className="space-x-1.5" side="bottom">
              <span>Clear</span>
              <KbdGroup>
                <Kbd>X</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </div>
        {displayProperties.includes("priority") && (
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-center justify-center"
          >
            <ItemsCombobox
              items={priorityOptions}
              value={priorityOptions.find(
                (option) => option.value === issue.priority
              )}
              onValueChange={(value) => {
                if (value) {
                  handleUpdateIssue({
                    priority: value.value as Issue["priority"],
                  });
                }
              }}
              placeholder="Set priority to..."
              kbd="P"
              isIcon
              triggerProps={{
                variant: "ghost",
                tooltip: {
                  content: "Set priority",
                  kbd: ["P"],
                  tooltipProps: {
                    collisionAvoidance: {
                      side: "flip",
                    },
                  },
                },
              }}
              contentProps={{
                side: "right",
              }}
            />
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {displayProperties.includes("id") && (
            <span className="text-xs-plus text-muted-foreground w-13 justify-self-start leading-none tracking-wide">
              {issue.id}
            </span>
          )}
          {displayProperties.includes("status") && (
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center justify-center"
            >
              <ItemsCombobox
                items={statusOptions}
                value={statusOptions.find(
                  (option) => option.value === issue.status
                )}
                onValueChange={(value) => {
                  if (value) {
                    handleUpdateIssue({
                      status: value.value as Issue["status"],
                    });
                  }
                }}
                placeholder="Set status to..."
                kbd="S"
                isIcon
                triggerProps={{
                  variant: "ghost",
                  tooltip: {
                    content: "Set status",
                    kbd: ["S"],
                    tooltipProps: {
                      collisionAvoidance: {
                        side: "flip",
                      },
                    },
                  },
                }}
                contentProps={{
                  side: "right",
                }}
              />
            </div>
          )}
        </div>
        <span
          title={issue.title}
          className="text-xs-plus min-w-0 truncate leading-none font-medium tracking-wide"
        >
          {issue.title}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {displayProperties.includes("labels") && (
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              <LabelCombobox issueId={issue.id} issueLabels={issueLabels} />
            </div>
          )}
          {displayProperties.includes("assignee") && (
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center justify-center"
            >
              <ItemsCombobox
                items={assigneesOptions}
                defaultValue={
                  assigneesOptions.find(
                    (option) => option.value === issue.assigneeId
                  ) ?? assigneesOptions[0]
                }
                placeholder="Assign to..."
                kbd="A"
                isIcon
                triggerProps={{
                  variant: "ghost",
                  tooltip: {
                    content: "Assign to",
                    kbd: ["A"],
                    tooltipProps: {
                      collisionAvoidance: {
                        side: "flip",
                      },
                    },
                  },
                }}
                contentProps={{
                  side: "right",
                }}
              />
            </div>
          )}
          {displayProperties.includes("created") && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="text-muted-foreground w-16 text-end text-xs tabular-nums">
                    {formatDate(issue.createdAt)}
                  </span>
                }
              />
              <TooltipContent>
                <span className="text-micro tabular-nums">
                  Created {format(issue.createdAt, "PPpp")}
                </span>
              </TooltipContent>
            </Tooltip>
          )}
          {displayProperties.includes("updated") && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="text-muted-foreground w-16 text-end text-xs tabular-nums">
                    {formatDate(issue.updatedAt)}
                  </span>
                }
              />
              <TooltipContent>
                <span className="text-micro tabular-nums">
                  Created {format(issue.updatedAt, "PPpp")}
                </span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-52">
        <ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger shortcut="S">
              <InProgressIcon />
              Status
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={issue.status}
                onValueChange={(value) => {
                  if (value) {
                    handleUpdateIssue({
                      status: value as Issue["status"],
                    });
                  }
                }}
              >
                {statusOptions.map((option) => (
                  <ContextMenuRadioItem
                    key={option.value}
                    value={option.value}
                    closeOnClick
                  >
                    {option.icon && (
                      <Icon icon={option.icon} color={option.color} />
                    )}
                    {option.label}
                  </ContextMenuRadioItem>
                ))}
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger shortcut="A">
              <HugeiconsIcon icon={EditUser02Icon} strokeWidth={2} />
              Assignee
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={issue.assigneeId}
                onValueChange={(value) => {
                  if (value) {
                    handleUpdateIssue({
                      assigneeId: value as Issue["assigneeId"],
                    });
                  }
                }}
              >
                {assigneesOptions.map((option: any) => (
                  <ContextMenuRadioItem
                    key={option.value}
                    value={option.value}
                    closeOnClick
                  >
                    {option.avatarUrl ? (
                      <Avatar className="size-4.5!">
                        <AvatarImage src={option.avatarUrl} />
                        <AvatarFallback>
                          <HugeiconsIcon icon={User02Icon} size={12} />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Icon icon={option.icon} strokeWidth={2} />
                    )}
                    {option.label}
                  </ContextMenuRadioItem>
                ))}
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger shortcut="P">
              <HugeiconsIcon icon={FullSignalIcon} strokeWidth={2} />
              Priority
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={issue.priority}
                onValueChange={(value) => {
                  if (value) {
                    handleUpdateIssue({
                      priority: value as Issue["priority"],
                    });
                  }
                }}
              >
                {priorityOptions.map((option) => (
                  <ContextMenuRadioItem
                    key={option.value}
                    value={option.value}
                    closeOnClick
                  >
                    {option.icon && (
                      <Icon icon={option.icon} color={option.color} />
                    )}
                    {option.label}
                  </ContextMenuRadioItem>
                ))}
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger shortcut="L">
              <HugeiconsIcon icon={LabelIcon} strokeWidth={2} />
              Labels
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                {issueLabelOptions.map((option) => (
                  <ContextMenuCheckboxItem
                    key={option.value}
                    checked={issue.labelIds.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleUpdateIssue({
                          labelIds: [...issue.labelIds, option.value],
                        });
                      } else {
                        handleUpdateIssue({
                          labelIds: issue.labelIds.filter(
                            (labelId) => labelId !== option.value
                          ),
                        });
                      }
                    }}
                  >
                    {option.icon && (
                      <Icon icon={option.icon} color={option.color} />
                    )}
                    {option.label}
                  </ContextMenuCheckboxItem>
                ))}
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
