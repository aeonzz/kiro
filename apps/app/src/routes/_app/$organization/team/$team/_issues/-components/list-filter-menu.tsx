import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListFilterMenuProps extends React.ComponentProps<
  typeof DropdownMenu
> {}

export function ListFilterMenu({ ...props }: ListFilterMenuProps) {
  return (
    <DropdownMenu {...props}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="xs" />}
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
          <span>Filter</span>
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
        {/* <DropdownMenuSearch
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
        </DropdownMenuGroup> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
