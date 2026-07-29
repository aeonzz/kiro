import * as React from "react";
import { Icon } from "@/utils/icon";
import {
  ArrowRight01Icon,
  Calendar01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "@tanstack/react-router";

import type { FilterOptions, IconType } from "@/types/inbox";
import { issueFilterOptions } from "@/config/team";
import {
  usePowerSyncOrgMembers,
  usePowerSyncTeamLabels,
  usePowerSyncTeamProjects,
  useTeamId,
} from "@/lib/collections/team-metadata-powersync";
import { cn } from "@/lib/utils";
import { useIssueFilters } from "@/hooks/use-issue-filter-store";
import { useIssueStatusOptions } from "@/hooks/use-issue-status";
import { useIssueTabKey } from "@/hooks/use-issue-tab-key";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface IssueFilterMenuProps extends React.ComponentProps<
  typeof DropdownMenu
> {
  filterOptions?: FilterOptions[];
  optionCountsByFilterId?: Record<string, Record<string, number>>;
}

export function IssueFilterMenu({
  onOpenChangeComplete,
  filterOptions: filterOptionsProp,
  optionCountsByFilterId,
  ...props
}: IssueFilterMenuProps) {
  const { team, organization } = useParams({
    from: "/_app/$organization/team/$team/_issues",
  });
  const { addFilter, filters } = useIssueFilters(useIssueTabKey(team));
  const teamId = useTeamId(organization, team);
  const statusOptions = useIssueStatusOptions(team);
  const teamLabels = usePowerSyncTeamLabels(teamId);
  const teamProjects = usePowerSyncTeamProjects(teamId);
  const orgMembers = usePowerSyncOrgMembers(organization);

  const filterOptions = React.useMemo(
    () =>
      filterOptionsProp ??
      issueFilterOptions.map((f) => {
        if (f.id === "status") return { ...f, options: statusOptions };
        if (f.id === "label") return { ...f, options: teamLabels };
        if (f.id === "assignee") return { ...f, options: orgMembers };
        if (f.id === "creator") return { ...f, options: orgMembers };
        if (f.id === "project") return { ...f, options: teamProjects };
        return f;
      }),
    [filterOptionsProp, statusOptions, teamLabels, orgMembers, teamProjects]
  );

  const [search, setSearch] = React.useState("");
  const [subMenuSearch, setSubMenuSearch] = React.useState("");
  const [dateOptionsSearch, setDateOptionsSearch] = React.useState("");

  const DATE_FILTER_IDS = React.useMemo(
    () =>
      new Set([
        "due-date",
        "created-date",
        "updated-date",
        "started-date",
        "completed-date",
        "time-in-status",
      ]),
    []
  );

  const nonDateFilterOptions = React.useMemo(
    () => filterOptions.filter((f) => !DATE_FILTER_IDS.has(f.id)),
    [filterOptions, DATE_FILTER_IDS]
  );

  const dateFilterOptions = React.useMemo(
    () => filterOptions.filter((f) => DATE_FILTER_IDS.has(f.id)),
    [filterOptions, DATE_FILTER_IDS]
  );

  const flattenedFilterOptions = React.useMemo(() => {
    const lowerSearch = search.toLowerCase();

    type FlatItem =
      | {
          type: "category";
          id: string;
          label: string;
          icon: IconType;
          options: FilterOptions["options"];
        }
      | { type: "dates-group" }
      | {
          type: "option";
          filterId: string;
          categoryLabel: string;
          value: string;
          label: string;
          icon?: IconType;
          avatarUrl?: string;
          color?: string;
        };

    if (lowerSearch.length < 2) {
      return [
        ...nonDateFilterOptions.map((f) => ({
          type: "category" as const,
          ...f,
        })),
        ...(dateFilterOptions.length > 0
          ? [{ type: "dates-group" as const }]
          : []),
      ] as FlatItem[];
    }

    const results: FlatItem[] = [];

    filterOptions.forEach((filter) => {
      const isCategoryMatch = filter.label.toLowerCase().includes(lowerSearch);
      if (isCategoryMatch) {
        results.push({
          type: "category",
          id: filter.id,
          label: filter.label,
          icon: filter.icon,
          options: filter.options,
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
  }, [search, filterOptions, nonDateFilterOptions, dateFilterOptions]);

  return (
    <DropdownMenu
      onOpenChangeComplete={(open) => {
        if (!open) {
          setSearch("");
          setSubMenuSearch("");
          setDateOptionsSearch("");
        }
        onOpenChangeComplete?.(open);
      }}
      {...props}
    >
      <Button
        variant="outline"
        size="icon-xs"
        tooltip={{
          content: "Add filter",
          kbd: ["F"],
        }}
        render={(triggerProps) => <DropdownMenuTrigger {...triggerProps} />}
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
        finalFocus={false}
        className="w-auto min-w-60"
        align="center"
        alignOffset={-32}
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
              {flattenedFilterOptions.map((item, i) => {
                if (item.type === "dates-group") {
                  return (
                    <DropdownMenuSub key="dates-group" closeParentOnEsc>
                      <DropdownMenuSubTrigger openOnHover>
                        <Icon icon={Calendar01Icon} strokeWidth={2} />
                        Dates
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="min-w-48">
                          <DropdownMenuGroup>
                            {dateFilterOptions.map((dateFilter) => {
                              const filteredDateOptions =
                                dateFilter.options.filter((opt) =>
                                  opt.label
                                    .toLowerCase()
                                    .includes(dateOptionsSearch.toLowerCase())
                                );
                              return (
                                <DropdownMenuSub
                                  key={dateFilter.id}
                                  closeParentOnEsc
                                  onOpenChange={(open) => {
                                    if (!open) setDateOptionsSearch("");
                                  }}
                                >
                                  <DropdownMenuSubTrigger openOnHover>
                                    <Icon
                                      icon={dateFilter.icon}
                                      strokeWidth={2}
                                    />
                                    {dateFilter.label}
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent side="left" className="min-w-44">
                                      <DropdownMenuSearch
                                        placeholder="Filter..."
                                        value={dateOptionsSearch}
                                        onChange={(e) =>
                                          setDateOptionsSearch(e.target.value)
                                        }
                                        autoFocus
                                      />
                                      {filteredDateOptions.length === 0 && (
                                        <DropdownMenuEmpty>
                                          No matching options
                                        </DropdownMenuEmpty>
                                      )}
                                      <DropdownMenuGroup>
                                        {filteredDateOptions.map(
                                          (subOption) => {
                                            const count =
                                              optionCountsByFilterId?.[
                                                dateFilter.id
                                              ]?.[subOption.value];
                                            return (
                                              <DropdownMenuCheckboxItem
                                                key={subOption.value}
                                                inset
                                                closeOnClick
                                                onCheckedChange={() => {
                                                  setTimeout(() => {
                                                    addFilter(
                                                      dateFilter.id,
                                                      subOption
                                                    );
                                                  }, 150);
                                                }}
                                              >
                                                <span className="flex-1">
                                                  {subOption.label}
                                                </span>
                                                {count !== undefined && (
                                                  <span className="text-muted-foreground/50 tabular-nums">
                                                    {count}
                                                  </span>
                                                )}
                                              </DropdownMenuCheckboxItem>
                                            );
                                          }
                                        )}
                                      </DropdownMenuGroup>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                              );
                            })}
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  );
                }

                if (item.type === "category") {
                  const filteredSubOptions = item.options.filter((opt) =>
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
                              const count =
                                optionCountsByFilterId?.[item.id]?.[
                                  subOption.value
                                ];
                              return (
                                <DropdownMenuCheckboxItem
                                  key={subOption.value}
                                  inset
                                  closeOnClick
                                  onCheckedChange={() => {
                                    setTimeout(() => {
                                      addFilter(item.id, subOption);
                                    }, 150);
                                  }}
                                >
                                  {subOption.avatarUrl ? (
                                    <Avatar className="size-4!">
                                      <AvatarImage src={subOption.avatarUrl} />
                                      <AvatarFallback>
                                        <HugeiconsIcon
                                          icon={User02Icon}
                                          size={10}
                                        />
                                      </AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    subOption.icon && (
                                      <Icon
                                        icon={subOption.icon}
                                        strokeWidth={2}
                                        color={subOption.color}
                                      />
                                    )
                                  )}
                                  <span className="flex-1">
                                    {subOption.label}
                                  </span>
                                  {count !== undefined && (
                                    <span className="text-muted-foreground/50 tabular-nums">
                                      {count}
                                    </span>
                                  )}
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
                    key={`${item.filterId}-${item.value}-${i}`}
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
