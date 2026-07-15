import * as React from "react";
import { getWorkflowIcon } from "@/config";
import { MOCK_USERS } from "@/mocks/users";
import { Icon } from "@/utils/icon";
import {
  EditUser02Icon,
  FullSignalIcon,
  LabelIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import type { Issue } from "@/types/issue";
import { issueFilterOptions } from "@/config/team";
import {
  addIssueLabel,
  removeIssueLabel,
} from "@/lib/collections/issue-label-links-powersync";
import { getIssuesPowerSyncCollection } from "@/lib/collections/issues-powersync";
import {
  usePowerSyncTeamLabels,
  usePowerSyncWorkflowStates,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { InProgressIcon } from "@/components/icons";

interface IssueContextMenuProps {
  issue: Issue;
}

export function IssueContextMenu({ issue }: IssueContextMenuProps) {
  const { organization, team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const issuesCollection = getIssuesPowerSyncCollection();

  const handleUpdate = (changes: Partial<Issue>) => {
    issuesCollection.update(issue.id, (draft) => {
      Object.assign(draft, changes);
    });
  };

  const priorityOptions =
    issueFilterOptions.find((o) => o.id === "priority")?.options ?? [];

  const teamId = useTeamId(organization, team);
  const workflowStates = usePowerSyncWorkflowStates(teamId);
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

  const allLabelOptions = usePowerSyncTeamLabels(teamId);

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
    <ContextMenuContent className="min-w-44">
      <ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger shortcut="S">
            <InProgressIcon />
            Status
          </ContextMenuSubTrigger>
          <IssueContextMenuSubContent>
            <ContextMenuRadioGroup
              value={issue.stateId}
              onValueChange={(value) => {
                if (value) handleUpdate({ stateId: value });
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
          </IssueContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger shortcut="A">
            <HugeiconsIcon icon={EditUser02Icon} strokeWidth={2} />
            Assignee
          </ContextMenuSubTrigger>
          <IssueContextMenuSubContent>
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
          </IssueContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger shortcut="P">
            <HugeiconsIcon icon={FullSignalIcon} strokeWidth={2} />
            Priority
          </ContextMenuSubTrigger>
          <IssueContextMenuSubContent>
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
          </IssueContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger shortcut="L">
            <HugeiconsIcon icon={LabelIcon} strokeWidth={2} />
            Labels
          </ContextMenuSubTrigger>
          <IssueContextMenuSubContent>
            <ContextMenuGroup>
              {allLabelOptions.map((option) => (
                <ContextMenuCheckboxItem
                  key={option.value}
                  checked={issue.labelIds.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) addIssueLabel(issue.id, option.value);
                    else removeIssueLabel(issue.id, option.value);
                  }}
                  closeOnClick
                >
                  {option.icon && (
                    <Icon icon={option.icon} color={option.color} />
                  )}
                  {option.label}
                </ContextMenuCheckboxItem>
              ))}
            </ContextMenuGroup>
          </IssueContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuGroup>
    </ContextMenuContent>
  );
}

function IssueContextMenuSubContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextMenuSubContent className="min-w-52">
      {children}
    </ContextMenuSubContent>
  );
}
