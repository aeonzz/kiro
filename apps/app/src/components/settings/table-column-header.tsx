import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  ArrowUpDownIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TableColumnHeaderProps<TData> extends Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> {
  showDefaultArrow?: boolean;
  title: string;
  column: Column<TData, unknown>;
}

export function TableColumnHeader<TData>({
  showDefaultArrow = false,
  title,
  column,
  className,
  variant = "ghost",
  size = "xs",
  ...props
}: TableColumnHeaderProps<TData>) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => column.toggleSorting()}
      className={cn("group/settings-table-column-header", className)}
      {...props}
    >
      {title}
      <HugeiconsIcon
        icon={
          sorted === "asc"
            ? ArrowUp02Icon
            : sorted === "desc"
              ? ArrowDown02Icon
              : ArrowUpDownIcon
        }
        strokeWidth={2}
        className={cn(
          "ease-out-expo transition-opacity duration-450",
          showDefaultArrow
            ? "opacity-100"
            : "opacity-0 group-hover/settings-table-column-header:opacity-100"
        )}
      />
    </Button>
  );
}
