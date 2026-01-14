import * as React from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const useFilter = AutocompletePrimitive.useFilter;

const Autocomplete = AutocompletePrimitive.Root;

const AutocompleteValue = AutocompletePrimitive.Value;

const AutocompleteCollection = AutocompletePrimitive.Collection;

function AutocompleteInput({
  className,
  render,
  ...props
}: AutocompletePrimitive.Input.Props) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(className)}
      render={render ?? <Input />}
      {...props}
    />
  );
}

function AutocompleteTrigger({
  ...props
}: AutocompletePrimitive.Trigger.Props) {
  return (
    <AutocompletePrimitive.Trigger
      data-slot="autocomplete-trigger"
      {...props}
    />
  );
}

function AutocompleteIcon({
  className,
  ...props
}: AutocompletePrimitive.Icon.Props) {
  return (
    <AutocompletePrimitive.Icon
      data-slot="autocomplete-icon"
      className={cn(
        "opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&svg]:size-4 [&svg]:shrink-0 [&svg]:cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props) {
  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      className={cn(
        "shrink-0 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&svg]:size-4 [&svg]:shrink-0 [&svg]:cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn(
        "max-h-[min(23rem,var(--available-height))] overflow-y-auto overscroll-contain p-1 data-empty:m-0 data-empty:p-0",
        className
      )}
      {...props}
    />
  );
}

function AutocompletePortal({ ...props }: AutocompletePrimitive.Portal.Props) {
  return (
    <AutocompletePrimitive.Portal data-slot="autocomplete-portal" {...props} />
  );
}

function AutocompleteOverlay({
  className,
  ...props
}: AutocompletePrimitive.Backdrop.Props) {
  return (
    <AutocompletePrimitive.Backdrop
      data-slot="autocomplete-overlay"
      className={cn("absolute inset-0", className)}
      {...props}
    />
  );
}

function AutocompleteContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  ...props
}: AutocompletePrimitive.Popup.Props &
  Pick<
    AutocompletePrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset"
  >) {
  return (
    <AutocompletePortal>
      <AutocompleteOverlay />
      <AutocompletePrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate"
      >
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          className={cn(
            "group bg-popover text-popover-foreground shadow-popup-border max-h-[min(23rem,var(--available-height))] w-(--anchor-width) max-w-(--available-width) overflow-hidden rounded-md transition-[transform,scale,opacity] duration-150 ease-out",
            "origin-(--transform-origin) data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className
          )}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePortal>
  );
}

function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn(
        "text-muted-foreground flex items-center gap-2 px-2 py-1.5 text-sm font-normal empty:m-0 empty:p-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "text-muted-foreground py-2 text-center text-sm empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteRow({ ...props }: AutocompletePrimitive.Row.Props) {
  return <AutocompletePrimitive.Row data-slot="autocomplete-row" {...props} />;
}

function AutocompleteItem({
  className,
  ...props
}: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteGroup({ ...props }: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group data-slot="autocomplete-group" {...props} />
  );
}

function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-xs font-medium",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteValue,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteIcon,
  AutocompleteClear,
  AutocompleteList,
  AutocompletePortal,
  AutocompleteOverlay,
  AutocompleteContent,
  AutocompleteStatus,
  AutocompleteEmpty,
  AutocompleteCollection,
  AutocompleteRow,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteSeparator,
  useFilter,
};
