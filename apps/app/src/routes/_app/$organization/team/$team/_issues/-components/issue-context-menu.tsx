import { MOCK_USERS } from "@/mocks/users";
import * as React from "react";
import { Icon } from "@/utils/icon";
import {
  EditUser02Icon,
  FullSignalIcon,
  LabelIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Issue } from "@/types/issue";
import { getWorkflowIcon } from "@/config";
import { issueFilterOptions } from "@/config/team";
import { issueQueries } from "@/lib/query-factory";
import { useTeamLabels } from "@/hooks/use-team-labels";
import { useTeamWorkflowStates } from "@/hooks/use-team-workflow-states";
import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InProgressIcon } from "@/components/icons";

interface IssueContextMenuProps {
  issue: Issue;
}

export function IssueContextMenu({ issue }: IssueContextMenuProps) {
  const qc = useQueryClient();
  const { team, organization } = useParams({ from: "/_app/$organization/team/$team/_issues" });
  const updateMutation = useMutation({
    ...issueQueries.mutations.update(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: issueQueries.lists({ organizationSlug: organization, teamSlug: team }).queryKey }),
  });

  const handleUpdate = (updates: Partial<Issue>) => {
    updateMutation.mutate({ data: { id: issue.id, ...updates } });
  };

  const priorityOptions =
    issueFilterOptions.find((o) => o.id === "priority")?.options ?? [];

  const workflowStates = useTeamWorkflowStates(team);
  const statusOptions = React.useMemo(
    () =>
      workflowStates.map((state) => ({
        value: state.id,
        label: state.name,
        icon: getWorkflowIcon(state.type),
        color: state.color,
      })),
    [workflowStates]
  );

  const allLabelOptions = useTeamLabels(team);

  const assigneesOptions = [
    {
      value: "unassigned",
      label: "No assignee",
      icon: User02Icon,
      color: "text-muted-foreground",
      avatarUrl: undefined,
    },
    ...MOCK_USERS.map((user) => ({
      value: user.id,
      label: user.name,
      icon: undefined,
      color: undefined,
      avatarUrl: user.avatarUrl,
    })),
  ];

  return (
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
                if (value) handleUpdate({ status: value as Issue["status"] });
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
                if (value)
                  handleUpdate({ assigneeId: value as Issue["assigneeId"] });
              }}
            >
              {assigneesOptions.map((option) => (
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
                    option.icon && <Icon icon={option.icon} strokeWidth={2} />
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
                if (value)
                  handleUpdate({ priority: value as Issue["priority"] });
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
              {allLabelOptions.map((option) => (
                <ContextMenuCheckboxItem
                  key={option.value}
                  checked={issue.labelIds.includes(option.value)}
                  onCheckedChange={(checked) => {
                    handleUpdate({
                      labelIds: checked
                        ? [...issue.labelIds, option.value]
                        : issue.labelIds.filter((id) => id !== option.value),
                    });
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
  );
}

