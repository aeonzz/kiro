import * as React from "react";
import {
  MultiplicationSignIcon,
  Search01Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, type LinkProps } from "@tanstack/react-router";
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  GroupingState,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    isInteractive?: boolean;
  }
}

function SettingsTableContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-table-container"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

function SettingsTableHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-table-header"
      className={cn("space-y-4 px-16", className)}
      {...props}
    />
  );
}

function SettingsTableTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="settings-table-title"
      className={cn(
        "text-foreground scroll-m-20 text-2xl font-medium",
        className
      )}
      {...props}
    />
  );
}

function SettingsTableAction({
  cols,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  cols?: number;
}) {
  return (
    <div
      data-slot="settings-table-action"
      className={cn("grid gap-2 *:flex *:items-center", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
      {...props}
    />
  );
}

type FilterOption = {
  value: string;
  label: string;
};

interface SettingsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSorting?: SortingState;
  getRowLink?: (data: TData) => LinkProps;
  getRowContextMenu?: (data: TData) => React.ReactNode;
  filterColumn?: string;
  filterPlaceholder?: string;
  filterOptions?: FilterOption[];
  filterSelectColumn?: string;
  children?: React.ReactNode;
}

function SettingsTable<TData, TValue>({
  columns,
  data,
  defaultSorting = [],
  getRowLink,
  getRowContextMenu,
  filterColumn,
  filterPlaceholder = "Filter...",
  filterOptions,
  filterSelectColumn,
  children,
}: SettingsTableProps<TData, TValue>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-8">
      <SettingsTableAction cols={2} className="w-full px-16">
        <div className="gap-2">
          {filterColumn && (
            <InputGroup className="w-full max-w-xs">
              <InputGroupInput
                ref={inputRef}
                placeholder={filterPlaceholder}
                value={
                  (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filterColumn)
                    ?.setFilterValue(event.target.value)
                }
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
              />
              <InputGroupAddon>
                <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
              </InputGroupAddon>
              {(table.getColumn(filterColumn)?.getFilterValue() as string) && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Clear"
                    title="Clear"
                    size="icon-xs"
                    onClick={() => {
                      table.getColumn(filterColumn)?.setFilterValue("");
                      inputRef.current?.focus();
                    }}
                  >
                    <HugeiconsIcon
                      icon={MultiplicationSignIcon}
                      strokeWidth={2}
                    />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          )}

          {filterOptions && filterOptions.length > 0 && (
            <Select
              items={filterOptions}
              defaultValue={
                (filterSelectColumn
                  ? filterOptions.find(
                      (o) =>
                        o.value ===
                        (table
                          .getColumn(filterSelectColumn)
                          ?.getFilterValue() as string)
                    )
                  : undefined) ?? filterOptions[0]
              }
              onValueChange={(val) => {
                const column = filterSelectColumn
                  ? table.getColumn(filterSelectColumn)
                  : undefined;
                if (column) {
                  column.setFilterValue(val?.value === "all" ? "" : val?.value);
                }
              }}
              itemToStringValue={(item) => item.value}
              itemToStringLabel={(item) => item.label}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">{children}</div>
      </SettingsTableAction>
      <div className="group/settings-table overflow-hidden">
        {table.getRowModel().rows?.length ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "text-muted-foreground text-xs-plus h-8 font-normal first:pl-16 last:pr-16",
                          header.column.columnDef.meta?.className
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const linkProps = getRowLink?.(row.original);
                const contextMenuContent = getRowContextMenu?.(row.original);

                const rowContent = (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "group/row data-popup-open:bg-muted/50 [&:has([data-popup-open])]:bg-muted/50 data-base-ui-inert:relative data-base-ui-inert:z-0",
                      linkProps && "relative"
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isInteractive =
                        cell.column.columnDef.meta?.isInteractive;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "h-12 py-0 first:pl-16 last:pr-16",
                            cell.column.columnDef.meta?.className
                          )}
                        >
                          {index === 0 && contextMenuContent && (
                            <ContextMenuContent className="w-40">
                              {contextMenuContent}
                            </ContextMenuContent>
                          )}
                          {index === 0 && linkProps && (
                            <Link
                              {...(linkProps as any)}
                              className="absolute inset-0 z-10"
                            />
                          )}
                          <div
                            className={cn(
                              linkProps
                                ? isInteractive
                                  ? "relative z-20 in-data-base-ui-inert:z-0"
                                  : "relative z-0"
                                : undefined
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );

                if (contextMenuContent) {
                  return (
                    <ContextMenu key={row.id}>
                      <ContextMenuTrigger render={rowContent} />
                    </ContextMenu>
                  );
                }

                return rowContent;
              })}
            </TableBody>
          </Table>
        ) : (
          <Empty className="h-[356px] w-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyDescription>
                No team found with the selected filter.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (filterColumn) {
                    table.getColumn(filterColumn)?.setFilterValue("");
                  }
                  if (filterSelectColumn) {
                    table.getColumn(filterSelectColumn)?.setFilterValue("");
                  }
                }}
              >
                Clear filter
                <HugeiconsIcon icon={MultiplicationSignIcon} strokeWidth={2} />
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}

export {
  SettingsTableContainer,
  SettingsTableHeader,
  SettingsTableTitle,
  SettingsTableAction,
  SettingsTable,
};
