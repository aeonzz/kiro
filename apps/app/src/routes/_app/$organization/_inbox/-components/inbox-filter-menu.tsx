import * as React from "react";
import { Icon } from "@/utils/icon";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { filterOptions } from "@/config/inbox";
import { useInboxFilters } from "@/hooks/use-inbox-filter-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuEmpty,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSearch,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrganization } from "@/components/organization-context";

export function InboxFilterMenu({
  align = "end",
  onOpenChangeComplete,
  ...props
}: React.ComponentProps<typeof DropdownMenu> & {
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
}) {
  const { teams, activeOrganization } = useOrganization();
  const { addFilter } = useInboxFilters(activeOrganization?.id);
  const [search, setSearch] = React.useState("");
  const [subMenuSearch, setSubMenuSearch] = React.useState("");

  const flattenedFilterOptions = React.useMemo(() => {
    const lowerSearch = search.toLowerCase();

    if (lowerSearch.length < 2) {
      return filterOptions.map((f) => ({ type: "category" as const, ...f }));
    }

    const results: (
      | { type: "category"; id: string; label: string; icon: any }
      | {
          type: "option";
          filterId: string;
          categoryLabel: string;
          value: string;
          label: string;
          icon?: any;
        }
    )[] = [];

    filterOptions.forEach((filter) => {
      const isCategoryMatch = filter.label.toLowerCase().includes(lowerSearch);

      // Add category if it matches
      if (isCategoryMatch) {
        results.push({
          type: "category",
          id: filter.id,
          label: filter.label,
          icon: filter.icon,
        });
      }

      // Add matching options
      const options =
        filter.id === "team"
          ? teams.map((team) => ({
              value: team.id,
              label: team.name,
              icon: filter.icon,
            }))
          : filter.options;

      options.forEach((option) => {
        if (option.label.toLowerCase().includes(lowerSearch)) {
          results.push({
            type: "option",
            filterId: filter.id,
            categoryLabel: filter.label,
            ...option,
          });
        }
      });
    });

    return results;
  }, [search, teams]);

  return (
    <DropdownMenu
      {...props}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setSearch("");
          setSubMenuSearch("");
        }
        onOpenChangeComplete?.(open);
      }}
    >
      <Button
        variant="ghost"
        size="icon-xs"
        className="[&_svg:not([class*='size-'])]:size-4"
        tooltip={{
          content: "Filter notifications by",
          kbd: ["F"],
        }}
        render={DropdownMenuTrigger}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          color="currentColor"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6H21" />
          <path d="M6 12H18" />
          <path d="M9 18H15" />
        </svg>
      </Button>
      <DropdownMenuContent
        disableAnchorTracking={true}
        align={align}
        finalFocus={false}
        className="w-auto min-w-60"
      >
        <DropdownMenuSearch
          placeholder="Filter notification by..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          kbd="f"
        />
        {flattenedFilterOptions.length === 0 && (
          <DropdownMenuEmpty>No matching actions</DropdownMenuEmpty>
        )}
        <DropdownMenuGroup>
          {search.length === 1 ? (
            <DropdownMenuEmpty>No matching actions</DropdownMenuEmpty>
          ) : (
            <React.Fragment>
              {flattenedFilterOptions.map((item) => {
                if (item.type === "category") {
                  const filter = filterOptions.find((f) => f.id === item.id)!;
                  const options =
                    filter.id === "team"
                      ? teams.map((team) => ({
                          value: team.id,
                          label: team.name,
                          icon: filter.icon,
                        }))
                      : filter.options;

                  const filteredSubOptions = options.filter((opt) =>
                    opt.label
                      .toLowerCase()
                      .includes(subMenuSearch.toLowerCase())
                  );

                  return (
                    <DropdownMenuSub
                      key={item.id}
                      closeParentOnEsc
                      onOpenChange={(open) => {
                        if (!open) setSubMenuSearch("");
                      }}
                    >
                      <DropdownMenuSubTrigger openOnHover>
                        <Icon icon={item.icon} strokeWidth={2} />
                        {item.label}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="min-w-48">
                          <DropdownMenuSearch
                            placeholder="Filter..."
                            value={subMenuSearch}
                            onChange={(e) => setSubMenuSearch(e.target.value)}
                            autoFocus
                          />
                          {filteredSubOptions.length === 0 && (
                            <DropdownMenuEmpty>
                              No matching options
                            </DropdownMenuEmpty>
                          )}
                          <DropdownMenuGroup>
                            {filteredSubOptions.map((subOption) => {
                              return (
                                <DropdownMenuCheckboxItem
                                  key={subOption.value}
                                  inset
                                  closeOnClick
                                  onCheckedChange={() => {
                                    setTimeout(() => {
                                      addFilter(filter.id, subOption);
                                    }, 150);
                                  }}
                                >
                                  {subOption.icon && (
                                    <Icon
                                      icon={subOption.icon}
                                      strokeWidth={2}
                                    />
                                  )}
                                  {subOption.label}
                                </DropdownMenuCheckboxItem>
                              );
                            })}
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  );
                }

                return (
                  <DropdownMenuCheckboxItem
                    key={`${item.filterId}-${item.value}`}
                    closeOnClick
                    onCheckedChange={() => {
                      setTimeout(() => {
                        addFilter(item.filterId, item);
                      }, 150);
                    }}
                    className="gap-0 pr-2.5"
                  >
                    {item.icon && (
                      <Icon
                        icon={item.icon}
                        strokeWidth={2}
                        className="mr-2.5"
                      />
                    )}
                    <div className="text-muted-foreground flex items-center">
                      <span className="font-normal">{item.categoryLabel}</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={2}
                        className="mx-1 size-3.5"
                      />
                    </div>
                    {item.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </React.Fragment>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
