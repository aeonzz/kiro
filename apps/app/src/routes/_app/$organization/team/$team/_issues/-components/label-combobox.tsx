import * as React from "react";
import { Icon } from "@/utils/icon";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import type { FilterOption } from "@/types/inbox";
import {
  getIssueLabelLinksCollection,
  issueLabelLinkKey,
} from "@/lib/collections/issue-label-links";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Combobox, ComboboxTrigger } from "@/components/ui/combobox";
import { ItemsComboboxContent } from "@/components/items-combobox";

interface LabelComboboxProps {
  issueId: string;
  teamId: string;
  issueLabels: FilterOption[];
  allLabelOptions: FilterOption[];
}

export function LabelCombobox({
  issueId,
  teamId,
  issueLabels,
  allLabelOptions,
}: LabelComboboxProps) {
  const queryClient = useQueryClient();
  const { organization, team } = useParams({ from: "/_app/$organization/team/$team/_issues" });
  const labelLinksCollection = getIssueLabelLinksCollection({
    queryClient,
    organizationSlug: organization,
    teamSlug: team,
  });

  const setValue = (newOptions: FilterOption[]) => {
    const nextIds = new Set(newOptions.map((option) => option.value));
    const currentIds = new Set(issueLabels.map((option) => option.value));

    for (const labelId of nextIds) {
      if (!currentIds.has(labelId)) {
        labelLinksCollection.insert({ issueId, labelId, teamId });
      }
    }

    for (const labelId of currentIds) {
      if (!nextIds.has(labelId)) {
        labelLinksCollection.delete(issueLabelLinkKey(issueId, labelId));
      }
    }
  };

  return (
    <div className="group/labels flex h-7 flex-nowrap items-center gap-1">
      {issueLabels.map((item) => (
        <Combobox
          key={item.value}
          items={allLabelOptions}
          value={issueLabels}
          onValueChange={setValue}
          multiple
        >
          <ComboboxTrigger
            isIcon
            nativeButton={false}
            render={
              <Badge
                variant="outline"
                className="bg-background hover:bg-muted/50 border-border text-muted-foreground hover:text-foreground data-popup-open:text-foreground data-popup-open:bg-muted/50 h-6 shrink gap-1.5 border px-2 font-normal [&>svg]:size-4!"
              />
            }
          >
            {item.icon && (
              <Icon
                icon={item.icon}
                strokeWidth={2}
                className="shrink-0"
                color={item.color}
              />
            )}
            <span className="truncate">{item.label}</span>
          </ComboboxTrigger>
          <ItemsComboboxContent
            placeholder="Change or add labels..."
            kbd="L"
            side="right"
            className="min-w-64"
          />
        </Combobox>
      ))}
    </div>
  );
}
