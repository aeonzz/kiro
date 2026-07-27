import type { ComponentType } from "react";
import { FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { WorkflowType } from "@kiro/db";
import { useStatus } from "@powersync/react";

import { usePowerSyncWorkflowStates } from "@/lib/collections/team-metadata-powersync";
import { useCreateIssueStore } from "@/hooks/use-create-issue-store";
import { useIssueTab, type IssueTab } from "@/hooks/use-issue-tab-key";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { createIssueDialogHandle } from "@/components/create-issue-dialog";
import {
  BacklogIcon,
  InProgressIcon,
  TodoIcon,
  type IconProps,
} from "@/components/icons";

const tabEmptyState: Record<
  IssueTab,
  {
    icon: ComponentType<IconProps>;
    title: string;
    description: string;
    // Workflow type a new issue should land in so it's actually visible from
    // the tab it was created on. "all" shows every issue, so it takes the
    // team's own default instead.
    createAsType?: WorkflowType;
  }
> = {
  all: {
    icon: TodoIcon,
    title: "No issues yet",
    description: "Create the first issue for this team to get started.",
  },
  active: {
    icon: InProgressIcon,
    title: "No active issues",
    description: "Issues that are started or up next will show up here.",
    createAsType: "UNSTARTED",
  },
  backlog: {
    icon: BacklogIcon,
    title: "Nothing in the backlog",
    description: "Issues you're not ready to pick up yet will show up here.",
    createAsType: "BACKLOG",
  },
};

function EmptyIllustration({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border mb-1 rounded-xl border border-dashed p-6">
      {children}
    </div>
  );
}

/**
 * Shown when a tab resolves to zero issues — either because the filters exclude
 * everything, or because the tab genuinely has none.
 */
export function IssueEmptyState({
  hasFilters,
  onClearFilters,
  teamId,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
  teamId?: string;
}) {
  const tab = useIssueTab();
  const { hasSynced } = useStatus();
  const workflowStates = usePowerSyncWorkflowStates(teamId);
  const setTriggerContext = useCreateIssueStore(
    (state) => state.setTriggerContext
  );

  // Local SQLite reads empty both before the first sync lands and when there
  // really are no issues. Stay blank until we can tell the two apart, so a cold
  // load doesn't flash "No issues yet" at someone who has plenty.
  if (!hasSynced) return null;

  if (hasFilters) {
    return (
      <Empty className="h-full border-none">
        <EmptyHeader>
          <EmptyIllustration>
            <HugeiconsIcon
              icon={FilterIcon}
              size={26}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
          </EmptyIllustration>
          <EmptyTitle>No issues matching the filters</EmptyTitle>
          <EmptyDescription>
            Try adjusting or clearing your filters.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" size="sm" onClick={() => onClearFilters()}>
          Clear filters
        </Button>
      </Empty>
    );
  }

  const { icon: Icon, title, description, createAsType } = tabEmptyState[tab];
  const createAsStatus = createAsType
    ? [...workflowStates]
        .filter((state) => state.type === createAsType)
        .sort((a, b) => a.position - b.position)[0]?.id
    : undefined;

  return (
    <Empty className="h-full border-none">
      <EmptyHeader>
        <EmptyIllustration>
          <Icon size={26} className="text-muted-foreground" />
        </EmptyIllustration>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // Always overwrite rather than clear, so a context left behind by a
          // group trigger can't leak into this one.
          setTriggerContext({ teamId, status: createAsStatus });
          createIssueDialogHandle.open(null);
        }}
      >
        Create issue
      </Button>
    </Empty>
  );
}
