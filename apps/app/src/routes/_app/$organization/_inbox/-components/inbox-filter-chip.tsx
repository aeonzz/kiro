import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { filterOptions } from "@/config/inbox";
import { cn } from "@/lib/utils";
import { InboxFilter, useInboxFilters } from "@/hooks/use-inbox-filter-store";
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

export function InboxFilterChip({
  filter,
  orgId,
  className,
  ...props
}: {
  filter: InboxFilter;
  orgId?: string;
} & React.ComponentProps<"div">) {
  const { removeFilter, updateFilterOperator, toggleFilterValue } =
    useInboxFilters(orgId);
  const [search, setSearch] = React.useState("");

  const category = filterOptions.find((f) => f.id === filter.filterId);

  const isMulti = filter.options.length > 1;
  const displayOperator =
    filter.operator === "is not" ? "is not" : isMulti ? "is any of" : "is";

  const options = filter.options;
  const valueLabel =
    filter.options.length > 1
      ? `${filter.options.length} ${category?.multiLabel}`
      : filter.options.map((o) => o.label).join(", ");

  const filteredSelectedOptions = filter.options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAvailableOptions =
    category?.options.filter(
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
        {category?.icon && (
          <HugeiconsIcon
            icon={category.icon}
            strokeWidth={2}
            className="@max-md/inbox-panel:hidden"
          />
        )}
        <span className="text-foreground/95 shrink-0 font-normal whitespace-nowrap">
          {category?.label}
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
                updateFilterOperator(filter.id, isMulti ? "is any of" : "is")
              }
              closeOnClick
            >
              {isMulti ? "is any of" : "is"}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filter.operator === "is not"}
              onCheckedChange={() => updateFilterOperator(filter.id, "is not")}
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
          {filter.filterId === "status-type" &&
          options.some((option) => option.icon) ? (
            <span className="mr-1 flex items-center @max-md/inbox-panel:hidden">
              {options
                .slice(0, 3)
                .map(
                  (option) =>
                    option.icon && (
                      <HugeiconsIcon
                        key={option.value}
                        icon={option.icon}
                        strokeWidth={2}
                        className="bg-muted outline-muted rounded-full outline-1 duration-200 not-first:-ml-1"
                      />
                    )
                )}
            </span>
          ) : (
            !isMulti &&
            options.map(
              (option) =>
                option.icon && (
                  <HugeiconsIcon
                    key={option.value}
                    icon={option.icon}
                    strokeWidth={2}
                    className="bg-muted outline-muted rounded-full outline-1 duration-200 not-first:-ml-1 @max-md/inbox-panel:hidden"
                  />
                )
            )
          )}
          <span className="whitespace-nowrap">{valueLabel}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit min-w-52">
          <DropdownMenuSearch
            placeholder={category?.label}
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
                    toggleFilterValue(filter.id, option);
                  }, 150);
                }}
                closeOnClick
              >
                {option.icon && (
                  <HugeiconsIcon icon={option.icon} strokeWidth={2} />
                )}
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          {filteredSelectedOptions.length > 0 &&
            filteredAvailableOptions.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuGroup>
            {filteredAvailableOptions.map((subOption) => {
              return (
                <DropdownMenuCheckboxItem
                  key={subOption.value}
                  inset
                  checked={false}
                  onCheckedChange={() => {
                    setTimeout(() => {
                      toggleFilterValue(filter.id, subOption);
                    }, 150);
                  }}
                  closeOnClick
                >
                  {subOption.icon && (
                    <HugeiconsIcon icon={subOption.icon} strokeWidth={2} />
                  )}
                  {subOption.label}
                </DropdownMenuCheckboxItem>
              );
            })}
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
        onClick={() => removeFilter(filter.id)}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
      </Button>
    </div>
  );
}
