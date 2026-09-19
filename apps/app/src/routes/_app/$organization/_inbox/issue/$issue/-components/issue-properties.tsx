import * as React from "react";
import { Icon } from "@/utils/icon";
import {
  Folder01Icon,
  LabelIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLiveQuery } from "@tanstack/react-db";

import {
  getIssueLabelLinksCollection,
  setIssueLabels,
} from "@/lib/collections/issue-label-links-powersync";
import {
  getIssuesPowerSyncCollection,
  type PowerSyncIssueDetail,
} from "@/lib/collections/issues-powersync";
import {
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
} from "@/lib/collections/team-metadata-powersync";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxTrigger } from "@/components/ui/combobox";
import { ItemsComboboxContent } from "@/components/items-combobox";

import { PropertiesGroup } from "./properties-group";
import { PropertyCombobox, PropertySection } from "./property-controls";

const NO_PROJECT = "none";

export function IssueProperties({
  issue,
  organization,
}: {
  issue: PowerSyncIssueDetail;
  organization: string;
}) {
  const issuesCollection = React.useMemo(
    () => getIssuesPowerSyncCollection(),
    []
  );

  const teamProjects = usePowerSyncTeamProjects(issue.teamId);

  const handleUpdate = React.useCallback(
    (changes: Record<string, unknown>) => {
      issuesCollection.update(issue.id, (draft) => {
        Object.assign(draft, changes, { updatedAt: new Date().toISOString() });
      });
    },
    [issuesCollection, issue.id]
  );

  const projectOptions = React.useMemo(
    () => [
      { value: NO_PROJECT, label: "No project", icon: Folder01Icon },
      ...teamProjects.map((project) => ({
        value: project.value,
        label: project.label,
        icon: Folder01Icon,
        color: project.color,
      })),
    ],
    [teamProjects]
  );

  return (
    <aside className="flex w-full flex-col gap-6">
      <PropertiesGroup
        issue={issue}
        organization={organization}
        onUpdate={handleUpdate}
      />
      <LabelsGroup issue={issue} />
      {projectOptions.length > 1 && (
        <PropertySection title="Project">
          <PropertyCombobox
            items={projectOptions}
            value={
              projectOptions.find(
                (option) => option.value === (issue.projectId ?? NO_PROJECT)
              ) ?? projectOptions[0]
            }
            onValueChange={(value) => {
              if (!value) return;
              handleUpdate({
                projectId: value.value === NO_PROJECT ? null : value.value,
              });
            }}
            emptyLabel="Add to project"
            isEmpty={!issue.projectId}
            searchPlaceholder="Set project..."
            tooltip="Set project"
            kbd="G"
          />
        </PropertySection>
      )}
    </aside>
  );
}

const ADD_LABEL_TRIGGER = "__add__";

const labelChipClassName =
  "bg-background hover:bg-muted/50 border-border text-muted-foreground hover:text-foreground data-popup-open:text-foreground data-popup-open:bg-muted/50 h-6 shrink gap-1.5 border px-2 font-normal [&>svg]:size-4!";

function LabelsGroup({ issue }: { issue: PowerSyncIssueDetail }) {
  const [openLabelValue, setOpenLabelValue] = React.useState<string | null>(
    null
  );
  const linkCollection = React.useMemo(
    () => getIssueLabelLinksCollection(),
    []
  );
  const allLabelOptions = usePowerSyncTeamLabels(issue.teamId);

  const { data: links = [] } = useLiveQuery(
    (q) => q.from({ link: linkCollection }),
    [linkCollection]
  );

  const issueLabels = React.useMemo(() => {
    const linked = new Set(
      links
        .filter((link) => link.issueId === issue.id)
        .map((link) => link.labelId as string)
    );
    return allLabelOptions.filter((option) => linked.has(option.value));
  }, [links, allLabelOptions, issue.id]);

  const setValue = (options: typeof allLabelOptions) => {
    setIssueLabels(
      issue.id,
      options.map((option) => option.value)
    );
    setOpenLabelValue(null);
  };

  if (issueLabels.length === 0) {
    return (
      <PropertySection title="Labels">
        <Combobox
          items={allLabelOptions}
          value={issueLabels}
          multiple
          open={openLabelValue === ADD_LABEL_TRIGGER}
          onOpenChange={(open) =>
            setOpenLabelValue(open ? ADD_LABEL_TRIGGER : null)
          }
          onValueChange={setValue}
        >
          <Button
            variant="ghost"
            size="sm"
            render={<ComboboxTrigger isIcon />}
            className="h-7 w-fit justify-start gap-2 px-2 font-normal"
            tooltip={{ content: "Add label", kbd: ["L"] }}
          >
            <Icon icon={LabelIcon} strokeWidth={2} />
            <span className="text-muted-foreground">Add label</span>
          </Button>
          <ItemsComboboxContent placeholder="Add labels..." kbd="L" />
        </Combobox>
      </PropertySection>
    );
  }

  return (
    <PropertySection title="Labels">
      <div className="flex flex-wrap items-center gap-1 px-2">
        {issueLabels.map((label) => (
          <Combobox
            key={label.value}
            items={allLabelOptions}
            value={issueLabels}
            multiple
            open={openLabelValue === label.value}
            onOpenChange={(open) =>
              setOpenLabelValue(open ? label.value : null)
            }
            onValueChange={setValue}
          >
            <ComboboxTrigger
              isIcon
              nativeButton={false}
              render={<Badge variant="outline" className={labelChipClassName} />}
            >
              {label.icon && (
                <Icon
                  icon={label.icon}
                  strokeWidth={2}
                  color={label.color}
                  className="shrink-0"
                />
              )}
              <span className="truncate">{label.label}</span>
            </ComboboxTrigger>
            <ItemsComboboxContent
              placeholder="Change or add labels..."
              kbd="L"
              className="min-w-64"
            />
          </Combobox>
        ))}
        <Combobox
          items={allLabelOptions}
          value={issueLabels}
          multiple
          open={openLabelValue === ADD_LABEL_TRIGGER}
          onOpenChange={(open) => setOpenLabelValue(open ? ADD_LABEL_TRIGGER : null)}
          onValueChange={setValue}
        >
          <Button
            variant="ghost"
            size="icon-xs"
            render={<ComboboxTrigger isIcon />}
            className="[&_svg:not([class*='size-'])]:size-3.5"
            tooltip={{ content: "Add label", kbd: ["L"] }}
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            <span className="sr-only">Add label</span>
          </Button>
          <ItemsComboboxContent placeholder="Add labels..." kbd="L" />
        </Combobox>
      </div>
    </PropertySection>
  );
}
