import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface OptionControlProps<T> extends React.ComponentProps<"div"> {
  icon?: IconSvgElement;
  label: string;
  options: T[];
  value?: T;
  onValueChange?: (value: T) => void;
}

export function OptionControlSelect<
  T extends { value: string; label: string },
>({
  id,
  icon,
  label,
  options,
  value,
  onValueChange,
  className,
  children,
  ...props
}: OptionControlProps<T>) {
  return (
    <div
      className={cn("group/option-control flex h-6 items-center", className)}
      {...props}
    >
      <div className="flex flex-1 items-center gap-1.5">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            strokeWidth={2}
            className="text-muted-foreground size-4 group-data-[rotate='true']/option-control:rotate-90"
          />
        )}
        <Label
          htmlFor={id}
          className="text-muted-foreground text-xs font-normal"
        >
          {label}
        </Label>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <Select
          value={value}
          itemToStringValue={(item) => item.value}
          onValueChange={(val) => {
            if (!val) return;
            onValueChange?.(val);
          }}
        >
          <SelectTrigger id={id} className="w-full" size="xs" variant="secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            alignItemWithTrigger={false}
            className="min-w-(--anchor-width)"
          >
            <SelectGroup className="*:data-[slot=select-item]:py-1">
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option}
                  className="*:data-[slot=select-item-indicator]:right-1"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {children}
      </div>
    </div>
  );
}

interface OptionControlSwitchProps extends React.ComponentProps<"div"> {
  icon?: IconSvgElement;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function OptionControlSwitch({
  id,
  icon,
  label,
  checked,
  onCheckedChange,
  className,
  ...props
}: OptionControlSwitchProps) {
  return (
    <div className={cn("flex h-6 items-center", className)} {...props}>
      <div className="flex flex-1 items-center gap-1.5">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            strokeWidth={2}
            className="text-muted-foreground size-4"
          />
        )}
        <Label
          htmlFor={id}
          className="text-muted-foreground text-xs font-normal"
        >
          {label}
        </Label>
      </div>
      <div className="flex flex-1 items-center justify-end">
        <Switch
          id={id}
          size="sm"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
    </div>
  );
}
