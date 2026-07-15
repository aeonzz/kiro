import * as React from "react";
import { Icon } from "@/utils/icon";

import type { FilterOption } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { setIssueLabels } from "@/lib/collections/issue-label-links-powersync";
import { Badge } from "@/components/ui/badge";
import { Combobox, ComboboxTrigger } from "@/components/ui/combobox";
import { ItemsComboboxContent } from "@/components/items-combobox";

interface LabelComboboxProps {
  issueId: string;
  issueLabels: FilterOption[];
  allLabelOptions: FilterOption[];
}

export function LabelCombobox({ issueId, issueLabels, allLabelOptions }: LabelComboboxProps) {
  const [openLabelValue, setOpenLabelValue] = React.useState<string | null>(
    null
  );

  const setValue = (newOptions: FilterOption[]) => {
    setIssueLabels(
      issueId,
      newOptions.map((o) => o.value)
    );
  };

  return (
    <div className="group/labels flex h-7 flex-nowrap items-center gap-1">
      {issueLabels.map((item) => (
        <Combobox
          key={item.value}
          items={allLabelOptions}
          value={issueLabels}
          open={openLabelValue === item.value}
          onOpenChange={(open) => setOpenLabelValue(open ? item.value : null)}
          onValueChange={(newOptions) => {
            setValue(newOptions);
            setOpenLabelValue(null);
          }}
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
