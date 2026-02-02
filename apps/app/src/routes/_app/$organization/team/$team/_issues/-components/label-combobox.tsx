import * as React from "react";
import { issueLabelOptions } from "@/config";
import { FilterIcon } from "@/utils/filter-icon";

import type { FilterOption } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { useIssueStore } from "@/hooks/use-issue-store";
import { Badge } from "@/components/ui/badge";
import { Combobox, ComboboxTrigger } from "@/components/ui/combobox";
import { ItemsComboboxContent } from "@/components/items-combobox";

interface LabelComboboxProps {
  issueId: string;
  issueLabels: typeof issueLabelOptions;
}

export function LabelCombobox({ issueId, issueLabels }: LabelComboboxProps) {
  const updateIssue = useIssueStore((state) => state.updateIssue);

  const setValue = (newOptions: FilterOption[]) => {
    updateIssue(issueId, {
      labelIds: newOptions.map((o) => o.value),
    });
  };

  return (
    <div className="group/labels flex h-7 flex-nowrap items-center gap-1">
      {issueLabels.map((item) => (
        <Combobox
          key={item.value}
          items={issueLabelOptions}
          value={issueLabels}
          onValueChange={setValue}
          multiple
        >
          <ComboboxTrigger
            isIcon
            render={
              <Badge
                variant="outline"
                className="bg-background hover:bg-muted/50 border-border text-muted-foreground hover:text-foreground data-popup-open:text-foreground data-popup-open:bg-muted/50 h-6 shrink gap-1.5 border px-2 font-normal [&>svg]:size-4!"
              />
            }
          >
            {item.icon && (
              <FilterIcon
                icon={item.icon}
                strokeWidth={2}
                className={cn("shrink-0", item.iconFill)}
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
