import * as React from "react";
import type { StrictOmit } from "@/types";
import { FilterIcon } from "@/utils/filter-icon";

import type { FilterOption, IconType } from "@/types/inbox";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopupInput,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";

import { Button } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ItemsComboboxProps<
  T extends FilterOption,
  Multiple extends boolean = false,
> extends StrictOmit<
  React.ComponentProps<typeof Combobox<T, Multiple>>,
  "children" | "items"
> {
  items: T[];
  placeholder?: string;
  tooltipContent: React.ReactNode;
  kbd?: string;
  label?: string;
  icon?: IconType;
}

export function ItemsCombobox<
  T extends FilterOption,
  Multiple extends boolean = false,
>({
  items,
  placeholder = "Search...",
  tooltipContent,
  kbd,
  label,
  icon,
  ...props
}: ItemsComboboxProps<T, Multiple>) {
  return (
    <Combobox items={items} {...props}>
      <Tooltip>
        <TooltipTrigger
          render={
            <ComboboxTrigger
              render={
                <Button
                  variant="outline"
                  size="xs"
                  className="text-muted-foreground"
                >
                  <ComboboxValue>
                    {(value: T | T[]) => {
                      const selectedItems = Array.isArray(value)
                        ? value
                        : value
                          ? [value]
                          : [];

                      if (selectedItems.length === 0) {
                        return (
                          <span className="inline-flex items-center gap-1">
                            {icon && <FilterIcon icon={icon} strokeWidth={2} />}
                            {label}
                          </span>
                        );
                      }

                      if (selectedItems.length > 1) {
                        return (
                          <div className="-ml-0.5 inline-flex items-center">
                            {selectedItems.map((option) => (
                              <React.Fragment key={option.value}>
                                {option.icon && (
                                  <FilterIcon
                                    key={option.value}
                                    icon={option.icon}
                                    strokeWidth={2}
                                    className={cn(
                                      "size-4 not-first:-ml-3",
                                      option.iconFill
                                    )}
                                  />
                                )}
                              </React.Fragment>
                            ))}
                            <span className="inline-flex items-center gap-1">
                              {selectedItems.length} {label}
                            </span>
                          </div>
                        );
                      }

                      const selectedValue = selectedItems[0];

                      return (
                        <span className="-ml-0.5 inline-flex items-center gap-1">
                          {selectedValue.icon && (
                            <FilterIcon
                              icon={selectedValue.icon}
                              strokeWidth={2}
                              className={selectedValue.iconFill}
                            />
                          )}
                          {selectedValue.label}
                        </span>
                      );
                    }}
                  </ComboboxValue>
                </Button>
              }
            />
          }
        />
        <TooltipContent side="bottom" className="space-x-2">
          <span>{tooltipContent}</span>
          {kbd && <Kbd>{kbd}</Kbd>}
        </TooltipContent>
      </Tooltip>
      <ComboboxContent className="min-w-60">
        <ComboboxPopupInput placeholder={placeholder} kbd={kbd} />
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem key={item.value} value={item}>
              {item.icon && (
                <FilterIcon
                  icon={item.icon}
                  strokeWidth={2}
                  className={item.iconFill}
                />
              )}
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
