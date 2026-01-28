import * as React from "react";
import { issueLabelOptions } from "@/config";
import type { StrictOmit } from "@/types";
import { LabelIcon } from "@hugeicons/core-free-icons";

import { issueFilterOptions } from "@/config/team";
import { cn } from "@/lib/utils";
import { ItemsCombobox } from "@/components/items-combobox";

interface IssuePropertiesProps extends StrictOmit<
  React.ComponentProps<"div">,
  "children"
> {}

export function IssueProperties({ className, ...props }: IssuePropertiesProps) {
  const statusOptions =
    issueFilterOptions.find((option) => option.id === "status")?.options ?? [];
  const priorityOptions =
    issueFilterOptions.find((option) => option.id === "priority")?.options ??
    [];

  return (
    <div className={cn("flex items-center gap-2 p-3", className)} {...props}>
      <ItemsCombobox
        items={statusOptions}
        defaultValue={statusOptions[0]}
        placeholder="Change status..."
        tooltipContent="Change status"
        kbd="S"
      />
      <ItemsCombobox
        items={priorityOptions}
        defaultValue={priorityOptions[0]}
        placeholder="Set priority to..."
        tooltipContent="Set priority"
        kbd="P"
      />
      <ItemsCombobox
        items={issueLabelOptions}
        multiple
        defaultValue={[issueLabelOptions[0]]}
        placeholder="Add labels..."
        tooltipContent="Set labels"
        kbd="L"
        label="Labels"
        icon={LabelIcon}
      />
    </div>
  );
}
