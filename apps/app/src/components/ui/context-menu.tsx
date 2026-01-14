import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("select-none", className)}
      {...props}
    />
  );
}

function ContextMenuOverlay({
  className,
  ...props
}: ContextMenuPrimitive.Backdrop.Props) {
  return (
    <ContextMenuPrimitive.Backdrop
      data-slot="context-menu-overlay"
      className={cn("absolute inset-0", className)}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <ContextMenuPortal>
      <ContextMenuOverlay />
      <ContextMenuPrimitive.Positioner
        className="isolate outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "bg-popover text-popover-foreground shadow-popup-border ease-out-expo z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 duration-450 outline-none data-closed:overflow-hidden data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPortal>
  );
}

function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-muted-foreground px-2.5 py-2 text-xs font-medium data-inset:pl-8",
        className
      )}
      {...props}
    />
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 data-[variant=destructive]:data-highlighted:text-destructive data-[variant=destructive]:*:[svg]:text-destructive group/dropdown-menu-item text-xs-plus [&_svg]:text-muted-foreground data-highlighted:[&_svg]:text-accent-foreground relative flex items-center gap-2.5 rounded-md px-2.5 py-2 leading-4 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  delay = 0,
  shortcut,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
  shortcut?: string;
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      delay={delay}
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground text-xs-plus [&_svg]:text-muted-foreground data-highlighted:[&_svg]:text-accent-foreground data-popup-open:[&_svg]:text-accent-foreground flex items-center gap-2 rounded-md py-2 pr-1 pl-2.5 leading-4 outline-hidden select-none data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <span className="ml-auto flex items-center gap-2">
        {shortcut && (
          <ContextMenuShortcut className="translate-y-px">
            {shortcut}
          </ContextMenuShortcut>
        )}
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
      </span>
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function ContextMenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 2,
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className={cn("shadow-popup-border transition-none", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "group/dropdown-menu-checkbox-item data-highlighted:bg-accent data-highlighted:text-accent-foreground data-highlighted:[&_*:not([data-slot*='indicator'],[data-slot*='indicator']_*) ]:text-accent-foreground text-xs-plus [&_svg]:text-muted-foreground data-highlighted:[&_svg:not([data-slot*='indicator']_svg)]:text-accent-foreground relative flex items-center gap-2 rounded-md py-2 pr-8 pl-2.5 leading-4 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pr-2.5 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute flex items-center justify-center",
          inset
            ? "border-border group-data-checked/dropdown-menu-checkbox-item:bg-primary group-data-checked/dropdown-menu-checkbox-item:[&_svg]:text-primary-foreground left-2 size-3.5 rounded-sm border not-group-data-checked/dropdown-menu-checkbox-item:opacity-0 group-data-highlighted/dropdown-menu-checkbox-item:opacity-100 [&_svg]:size-3!"
            : "right-2"
        )}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup({
  ...props
}: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: ContextMenuPrimitive.RadioItem.Props) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "group/dropdown-menu-radio-item data-highlighted:bg-accent data-highlighted:text-accent-foreground data-highlighted:[&_*:not([data-slot*='indicator'],[data-slot*='indicator']_*)]:text-accent-foreground text-xs-plus [&_svg]:text-muted-foreground data-highlighted:[&_svg:not([data-slot*='indicator']_svg)]:text-accent-foreground relative flex items-center gap-2 rounded-md py-2 pr-8 pl-2.5 leading-4 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <ContextMenuPrimitive.RadioItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground group-focus/context-menu-item:text-accent-foreground text-micro ml-auto tracking-widest capitalize",
        className
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuPortal,
  ContextMenuTrigger,
  ContextMenuOverlay,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
