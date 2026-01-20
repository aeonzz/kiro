import * as React from "react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import { issueFilterOptions } from "@/config/team";
import { useIssueFilters } from "@/hooks/use-issue-filter-store";
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
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IssueFilterMenuProps extends React.ComponentProps<
  typeof DropdownMenu
> {}

export function IssueFilterMenu({ ...props }: IssueFilterMenuProps) {
  const { team } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const { addFilter, filters } = useIssueFilters(team);
  const [search, setSearch] = React.useState("");
  const [subMenuSearch, setSubMenuSearch] = React.useState("");

  const flattenedFilterOptions = React.useMemo(() => {
    const lowerSearch = search.toLowerCase();

    if (lowerSearch.length < 2) {
      return issueFilterOptions.map((f) => ({
        type: "category" as const,
        ...f,
      }));
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

    issueFilterOptions.forEach((filter) => {
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

      filter.options.forEach((option) => {
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
  }, [search]);

  return (
    <DropdownMenu {...props}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size={filters.length === 0 ? "xs" : "icon-xs"}
                />
              }
            />
          }
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
          {filters.length === 0 && <span>Filter</span>}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="space-x-2">
          <span>Add filter</span>
          <Kbd>F</Kbd>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        disableAnchorTracking={true}
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
                  const filter = issueFilterOptions.find(
                    (f) => f.id === item.id
                  )!;
                  const options = filter.options;

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
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
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
                                    <HugeiconsIcon
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
                      <HugeiconsIcon
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
