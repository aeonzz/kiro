import * as React from "react";
import type { StrictOmit } from "@/types";
import { FilterIcon } from "@/utils/filter-icon";
import { User02Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ItemsComboboxProps<T extends FilterOption> extends StrictOmit<
  React.ComponentProps<typeof Combobox<T, false>>,
  "children" | "items" | "multiple"
> {
  items: T[];
  placeholder?: string;
  kbd?: string;
  isIcon?: boolean;
  triggerProps?: StrictOmit<
    React.ComponentProps<typeof Button>,
    "children" | "render"
  >;
  contentProps?: StrictOmit<
    React.ComponentProps<typeof ComboboxContent>,
    "children"
  >;
}

export function ItemsCombobox<T extends FilterOption>({
  items,
  placeholder = "Search...",
  kbd,
  isIcon,
  triggerProps,
  contentProps,
  ...props
}: ItemsComboboxProps<T>) {
  const {
    variant = "outline",
    size = "xs",
    className,
    ...restTriggerProps
  } = triggerProps ?? {};

  return (
    <Combobox items={items} multiple={false} {...props}>
      <Button
        variant={variant}
        size={isIcon ? "icon-xs" : "xs"}
        render={<ComboboxTrigger isIcon />}
        className={cn("text-muted-foreground", className)}
        {...restTriggerProps}
      >
        <ComboboxValue>
          {(value: T | null) => {
            if (!value) return null;

            return (
              <React.Fragment>
                {isIcon ? (
                  <React.Fragment>
                    {value.avatarUrl ? (
                      <Avatar className="size-4.5!">
                        <AvatarImage src={value.avatarUrl} />
                        <AvatarFallback>
                          <HugeiconsIcon icon={User02Icon} size={12} />
                        </AvatarFallback>
                      </Avatar>
                    ) : value.icon ? (
                      <FilterIcon
                        icon={value.icon}
                        strokeWidth={2}
                        className={value.iconFill}
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={UserCircleIcon}
                        size={12}
                        className="text-muted-foreground"
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <span className="-ml-0.5 inline-flex items-center gap-1.5">
                    {value.avatarUrl ? (
                      <Avatar className="size-4.5!">
                        <AvatarImage src={value.avatarUrl} />
                        <AvatarFallback>
                          <HugeiconsIcon icon={User02Icon} size={12} />
                        </AvatarFallback>
                      </Avatar>
                    ) : value.icon ? (
                      <FilterIcon
                        icon={value.icon}
                        strokeWidth={2}
                        className={value.iconFill}
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={User02Icon}
                        size={12}
                        className="text-muted-foreground"
                      />
                    )}
                    {value.label}
                  </span>
                )}
              </React.Fragment>
            );
          }}
        </ComboboxValue>
      </Button>
      <ItemsComboboxContent
        placeholder={placeholder}
        kbd={kbd}
        {...contentProps}
      />
    </Combobox>
  );
}

interface MultiItemsComboboxProps<T extends FilterOption> extends StrictOmit<
  React.ComponentProps<typeof Combobox<T, true>>,
  "children" | "items" | "multiple"
> {
  items: T[];
  placeholder?: string;
  tooltipContent: React.ReactNode;
  kbd?: string;
  label: string;
  icon?: IconType;
  contentProps?: StrictOmit<
    React.ComponentProps<typeof ComboboxContent>,
    "children"
  >;
}

export function MultiItemsCombobox<T extends FilterOption>({
  items,
  placeholder = "Search...",
  tooltipContent,
  kbd,
  label,
  icon,
  contentProps,
  ...props
}: MultiItemsComboboxProps<T>) {
  return (
    <Combobox items={items} multiple={true} {...props}>
      <Button
        variant="outline"
        size="xs"
        render={<ComboboxTrigger isIcon />}
        tooltip={{
          content: tooltipContent,
          kbd: kbd ? [kbd] : undefined,
        }}
        className="text-muted-foreground"
      >
        <ComboboxValue>
          {(value: T[]) => {
            const selectedItems = value ?? [];

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
      <ItemsComboboxContent
        placeholder={placeholder}
        kbd={kbd}
        {...contentProps}
      />
    </Combobox>
  );
}

export function BadgedMultiItemsCombobox<T extends FilterOption>({
  items,
  placeholder = "Search...",
  kbd,
  contentProps,
  triggerProps,
  ...props
}: StrictOmit<
  React.ComponentProps<typeof Combobox<T, true>>,
  "children" | "items" | "multiple"
> & {
  items: T[];
  placeholder?: string;
  kbd?: string;
  triggerProps?: StrictOmit<
    React.ComponentProps<typeof Button>,
    "children" | "render"
  >;
  contentProps?: StrictOmit<
    React.ComponentProps<typeof ComboboxContent>,
    "children"
  >;
}) {
  return (
    <Combobox items={items} multiple={true} {...props}>
      <ComboboxTrigger
        isIcon
        render={
          <div
            className={cn(
              "group flex flex-wrap items-center gap-1.5",
              triggerProps?.className
            )}
          />
        }
      >
        <ComboboxValue>
          {(value: T[]) => {
            const selectedItems = value ?? [];

            return (
              <React.Fragment>
                {selectedItems.map((item) => (
                  <Badge
                    key={item.value}
                    variant="outline"
                    className="bg-background border-muted-foreground/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground group-data-popup-open:bg-muted/50 group-data-popup-open:text-foreground h-6 gap-1.5 px-2 font-normal"
                  >
                    {item.icon && (
                      <FilterIcon
                        icon={item.icon}
                        strokeWidth={2}
                        className={cn("size-3", item.iconFill)}
                      />
                    )}
                    {item.label}
                  </Badge>
                ))}
              </React.Fragment>
            );
          }}
        </ComboboxValue>
      </ComboboxTrigger>
      <ItemsComboboxContent
        placeholder={placeholder}
        kbd={kbd}
        {...contentProps}
      />
    </Combobox>
  );
}

export function ItemsComboboxContent({
  placeholder,
  kbd,
  className,
  ...props
}: React.ComponentProps<typeof ComboboxContent> & {
  placeholder?: string;
  kbd?: string;
}) {
  return (
    <ComboboxContent className={cn("min-w-60", className)} {...props}>
      <ComboboxPopupInput placeholder={placeholder} kbd={kbd} />
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxList>
        {(item: any) => (
          <ComboboxItem key={item.value} value={item}>
            {item.avatarUrl ? (
              <Avatar className="size-4!">
                <AvatarImage src={item.avatarUrl} />
                <AvatarFallback>
                  <HugeiconsIcon icon={User02Icon} size={14} />
                </AvatarFallback>
              </Avatar>
            ) : item.icon ? (
              <FilterIcon
                icon={item.icon}
                strokeWidth={2}
                className={item.iconFill}
              />
            ) : (
              <HugeiconsIcon
                icon={User02Icon}
                size={14}
                className="text-muted-foreground"
              />
            )}
            {item.label}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  );
}
