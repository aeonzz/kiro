import * as React from "react";
import { Icon } from "@/utils/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import type { FilterOption } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { issueQueries } from "@/lib/query-factory";
import { Badge } from "@/components/ui/badge";
import { Combobox, ComboboxTrigger } from "@/components/ui/combobox";
import { ItemsComboboxContent } from "@/components/items-combobox";

interface LabelComboboxProps {
  issueId: string;
  issueLabels: FilterOption[];
  allLabelOptions: FilterOption[];
}

export function LabelCombobox({ issueId, issueLabels, allLabelOptions }: LabelComboboxProps) {
  const qc = useQueryClient();
  const { organization, team } = useParams({ from: "/_app/$organization/team/$team/_issues" });
  const updateMutation = useMutation({
    ...issueQueries.mutations.update(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: issueQueries.lists({ organizationSlug: organization, teamSlug: team }).queryKey }),
  });

  const setValue = (newOptions: FilterOption[]) => {
    updateMutation.mutate({ data: { id: issueId, labelIds: newOptions.map((o) => o.value) } });
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
