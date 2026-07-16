import * as React from "react";
import { Icon } from "@/utils/icon";
import { Cancel01Icon, User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { FilterOption, FilterOptions } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuEmpty,
  DropdownMenuGroup,
  DropdownMenuSearch,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterOperator = "is" | "is not" | "is any of";

export interface GenericFilter {
  id: string; // The specific instance ID of the filter
  filterId: string; // The type of filter (e.g., 'status', 'team')
  operator: FilterOperator;
  options: FilterOption[];
}

interface FilterChipProps extends React.ComponentProps<"div"> {
  filter: GenericFilter;
  filterConfig?: FilterOptions;
  optionCounts?: Record<string, number>;
  onRemove: (id: string) => void;
  onUpdateOperator: (id: string, operator: FilterOperator) => void;
  onToggleValue: (id: string, option: FilterOption) => void;
}

function OptionIcon({ option }: { option: FilterOption }) {
  if (option.avatarUrl) {
    return (
      <Avatar className="size-4!">
        <AvatarImage src={option.avatarUrl} />
        <AvatarFallback>
          <HugeiconsIcon icon={User02Icon} size={10} />
        </AvatarFallback>
      </Avatar>
    );
  }
  if (option.icon) {
    return <Icon icon={option.icon} strokeWidth={2} color={option.color} />;
  }
  return null;
}

export function FilterChip({
  filter,
  filterConfig,
  optionCounts,
  onRemove,
  onUpdateOperator,
  onToggleValue,
  className,
  ...props
}: FilterChipProps) {
  const [search, setSearch] = React.useState("");

  const isMulti = filter.options.length > 1;
  const displayOperator =
    filter.operator === "is not" ? "is not" : isMulti ? "is any of" : "is";

  // Icons and colors are React components — they don't survive JSON serialization
  // in the persisted store. Merge them back from filterConfig at render time.
  const options = React.useMemo(() => {
    if (!filterConfig) return filter.options;
    const configMap = new Map(filterConfig.options.map((o) => [o.value, o]));
    return filter.options.map((o) => {
      const config = configMap.get(o.value);
      return config
        ? { ...o, icon: o.icon ?? config.icon, color: o.color ?? config.color, avatarUrl: o.avatarUrl ?? config.avatarUrl }
        : o;
    });
  }, [filter.options, filterConfig]);
  const valueLabel =
    filter.options.length > 1
      ? `${filter.options.length} ${filterConfig?.multiLabel ?? "items"}`
      : filter.options.map((o) => o.label).join(", ");

  const filteredSelectedOptions = filter.options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAvailableOptions =
    filterConfig?.options.filter(
      (subOption) =>
        !filter.options.some((o) => o.value === subOption.value) &&
        subOption.label.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <div
      {...props}
      className={cn(
        "[&_svg]:text-muted-foreground flex items-center gap-px text-xs font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>*:first-child]:rounded-l-sm [&>*:last-child]:rounded-r-sm",
        className
      )}
    >
      <div className="bg-muted text-muted-foreground flex items-center gap-1 px-1.5 py-1">
        {filterConfig?.icon && (
          <Icon
            icon={filterConfig.icon}
            strokeWidth={2}
            className="@max-md/inbox-panel:hidden"
          />
        )}
        <span className="text-foreground/95 shrink-0 font-normal whitespace-nowrap">
          {filterConfig?.label ?? filter.filterId}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="muted"
              size="xs"
              className="text-muted-foreground rounded-none border-none shadow-none"
            />
          }
        >
          {displayOperator}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem
              checked={filter.operator !== "is not"}
              onCheckedChange={() =>
                onUpdateOperator(filter.id, isMulti ? "is any of" : "is")
              }
              closeOnClick
            >
              {isMulti ? "is any of" : "is"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.operator === "is not"}
              onCheckedChange={() => onUpdateOperator(filter.id, "is not")}
              closeOnClick
            >
              Is not
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu
        onOpenChangeComplete={(open) => {
          if (!open) setSearch("");
        }}
      >
        <DropdownMenuTrigger
          render={
            <Button
              variant="muted"
              size="xs"
              className="rounded-none border-none font-normal shadow-none"
            />
          }
        >
          {filterConfig?.multiIcon && options.some((option) => option.icon) ? (
            <span className="flex items-center @max-md/inbox-panel:hidden">
              {options
                .slice(0, 3)
                .map(
                  (option) =>
                    option.icon && (
                      <Icon
                        key={option.value}
                        icon={option.icon}
                        strokeWidth={2}
                        color={option.color}
                        className={cn(
                          "bg-muted rounded-full outline-1 duration-200 outline-none not-first:-ml-1.5 group-hover/button:bg-[color-mix(in_oklab,var(--muted)90%,var(--muted-foreground))] group-aria-expanded/button:bg-[color-mix(in_oklab,var(--muted)90%,var(--muted-foreground))]"
                        )}
                      />
                    )
                )}
            </span>
          ) : (
            !isMulti &&
            options.map((option) =>
              option.avatarUrl ? (
                <Avatar key={option.value} className="size-4! @max-md/inbox-panel:hidden">
                  <AvatarImage src={option.avatarUrl} />
                  <AvatarFallback>
                    <HugeiconsIcon icon={User02Icon} size={10} />
                  </AvatarFallback>
                </Avatar>
              ) : (
                option.icon && (
                  <Icon
                    key={option.value}
                    icon={option.icon}
                    strokeWidth={2}
                    color={option.color}
                    className="rounded-full duration-200 outline-none not-first:-ml-1 @max-md/inbox-panel:hidden"
                  />
                )
              )
            )
          )}
          <span className="whitespace-nowrap">{valueLabel}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit min-w-52">
          <DropdownMenuSearch
            placeholder={filterConfig?.label}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <DropdownMenuGroup>
            {filteredSelectedOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                inset
                checked
                onCheckedChange={() => {
                  setTimeout(() => {
                    onToggleValue(filter.id, option);
                  }, 150);
                }}
                closeOnClick
              >
                <OptionIcon option={option} />
                <span className="flex-1">{option.label}</span>
                {optionCounts?.[option.value] !== undefined && (
                  <span className="text-muted-foreground tabular-nums">
                    {optionCounts[option.value]}
                  </span>
                )}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          {filteredSelectedOptions.length > 0 &&
            filteredAvailableOptions.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuGroup>
            {filteredAvailableOptions.map((subOption) => (
              <DropdownMenuCheckboxItem
                key={subOption.value}
                inset
                checked={false}
                onCheckedChange={() => {
                  setTimeout(() => {
                    onToggleValue(filter.id, subOption);
                  }, 150);
                }}
                closeOnClick
              >
                <OptionIcon option={subOption} />
                <span className="flex-1">{subOption.label}</span>
                {optionCounts?.[subOption.value] !== undefined && (
                  <span className="text-muted-foreground tabular-nums">
                    {optionCounts[subOption.value]}
                  </span>
                )}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          {filteredSelectedOptions.length === 0 &&
            filteredAvailableOptions.length === 0 && (
              <DropdownMenuEmpty>No matching options</DropdownMenuEmpty>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="muted"
        size="icon-xs"
        className="text-muted-foreground rounded-none border-none shadow-none"
        onClick={() => onRemove(filter.id)}
        tooltip={{
          content: "Remove filter",
        }}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
      </Button>
    </div>
  );
}
