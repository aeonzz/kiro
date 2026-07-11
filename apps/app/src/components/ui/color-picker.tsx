import * as React from "react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const colorPickerOptions = [
  "oklch(55.1% 0.027 264.364)",
  "oklch(44.6% 0.03 256.802)",
  "oklch(58.5% 0.233 277.117)",
  "oklch(60.9% 0.126 221.723)",
  "oklch(62.7% 0.194 149.214)",
  "oklch(76.9% 0.188 70.08)",
  "oklch(55.5% 0.163 48.998)",
  "oklch(70.2% 0.183 293.541)",
  "oklch(57.7% 0.245 27.325)",
] as const;

function ColorPicker({
  value,
  onValueChange,
  children,
  className,
  popoverContentProps,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  popoverContentProps?: React.ComponentProps<typeof PopoverContent>;
}) {
  const nativeInputId = React.useId();
  const nativeInputValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#6b7280";
  const hasCustomColor = !colorPickerOptions.some(
    (color) => color.toLowerCase() === value.toLowerCase()
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "focus-visible:ring-ring/50 grid size-full place-items-center rounded-md outline-none focus-visible:ring-1",
              className
            )}
          />
        }
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        {...popoverContentProps}
        className={cn(
          "w-auto min-w-0 flex-row items-center gap-3 rounded-md p-3",
          popoverContentProps?.className
        )}
      >
        {colorPickerOptions.map((color) => {
          const isSelected = color.toLowerCase() === value.toLowerCase();

          return (
            <button
              key={color}
              type="button"
              aria-label={`Select ${color}`}
              aria-pressed={isSelected}
              className="focus-visible:ring-ring/50 grid size-6 shrink-0 place-items-center rounded-full transition-transform outline-none hover:scale-105 focus-visible:ring-1"
              style={{ backgroundColor: color }}
              onClick={() => onValueChange(color)}
            >
              {isSelected && (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  strokeWidth={2.4}
                  className="text-white drop-shadow-sm"
                />
              )}
            </button>
          );
        })}
        <label
          htmlFor={nativeInputId}
          className="has-focus-visible:ring-ring/50 relative grid size-6 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full bg-[conic-gradient(from_180deg,#ef4444,#f59e0b,#22c55e,#06b6d4,#6366f1,#ec4899,#ef4444)] transition-transform outline-none hover:scale-105 has-focus-visible:ring-1"
          aria-label="Choose custom color"
        >
          {hasCustomColor && (
            <span
              className="absolute inset-1 rounded-full border border-white/50"
              style={{ backgroundColor: value }}
            />
          )}
          <input
            id={nativeInputId}
            type="color"
            value={nativeInputValue}
            onChange={(event) => onValueChange(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </PopoverContent>
    </Popover>
  );
}

export { ColorPicker, colorPickerOptions };
