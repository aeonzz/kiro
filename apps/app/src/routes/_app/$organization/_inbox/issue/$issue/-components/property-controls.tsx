import * as React from "react";
import { Icon } from "@/utils/icon";
import { User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { FilterOption } from "@/types/inbox";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxTrigger } from "@/components/ui/combobox";
import { ItemsComboboxContent } from "@/components/items-combobox";

export function PropertySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs-plus text-muted-foreground px-2 leading-none font-normal">
        {title}
      </span>
      <div className="flex flex-col items-start gap-0.5">{children}</div>
    </div>
  );
}

interface PropertyComboboxProps<T extends FilterOption> {
  items: T[];
  value?: T;
  onValueChange: (value: T | null) => void;
  emptyLabel: string;
  isEmpty?: boolean;
  searchPlaceholder?: string;
  tooltip: string;
  kbd?: string;
}

export function PropertyCombobox<T extends FilterOption>({
  items,
  value,
  onValueChange,
  emptyLabel,
  isEmpty = false,
  searchPlaceholder = "Search...",
  tooltip,
  kbd,
}: PropertyComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Combobox
      items={items}
      value={value ?? null}
      multiple={false}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(next) => {
        onValueChange(next);
        setOpen(false);
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        render={<ComboboxTrigger isIcon />}
        className="h-7 w-fit justify-start gap-2 px-2 font-normal"
        tooltip={{ content: tooltip, kbd: kbd ? [kbd] : undefined }}
      >
        {value?.avatarUrl ? (
          <Avatar className="size-4.5!">
            <AvatarImage src={value.avatarUrl} />
            <AvatarFallback>
              <HugeiconsIcon icon={User02Icon} size={12} />
            </AvatarFallback>
          </Avatar>
        ) : value?.icon ? (
          <Icon icon={value.icon} strokeWidth={2} color={value.color} />
        ) : (
          <HugeiconsIcon
            icon={User02Icon}
            strokeWidth={2}
            className="text-muted-foreground size-4"
          />
        )}
        <span className={cn("truncate", isEmpty && "text-muted-foreground")}>
          {isEmpty ? emptyLabel : (value?.label ?? emptyLabel)}
        </span>
      </Button>
      <ItemsComboboxContent placeholder={searchPlaceholder} kbd={kbd} />
    </Combobox>
  );
}
