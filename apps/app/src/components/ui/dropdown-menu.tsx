import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  ArrowRight01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Kbd } from "./kbd";

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "start",
  alignOffset,
  side = "bottom",
  sideOffset = 4,
  disableAnchorTracking,
  collisionBoundary,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "disableAnchorTracking"
    | "collisionBoundary"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        disableAnchorTracking={disableAnchorTracking}
        collisionBoundary={collisionBoundary}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "bg-popover text-popover-foreground shadow-popup-border yawa ease-out-expo z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 duration-450 outline-none data-closed:overflow-hidden data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "text-muted-foreground px-2.5 py-2 text-xs font-medium data-inset:pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSearch({
  className,
  autoComplete = "off",
  placeholder = "Search...",
  kbd,
  ...props
}: React.ComponentProps<typeof InputGroupInput> & {
  kbd?: string;
}) {
  return (
    <React.Fragment>
      <InputGroup
        className="h-7 shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0"
        data-slot="dropdown-menu-search"
      >
        <InputGroupInput
          className={cn(
            "placeholder:text-xs-plus placeholder:text-muted-foreground/60 focus:placeholder:text-muted-foreground text-xs-plus w-0 font-normal",
            className
          )}
          placeholder={placeholder}
          onKeyDown={(e) => {
            e.stopPropagation();
            props.onKeyDown?.(e);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            props.onPointerDown?.(e);
          }}
          onPointerEnter={(e) => {
            e.currentTarget.focus();
            props.onPointerEnter?.(e);
          }}
          autoComplete={autoComplete}
          {...props}
        />
        {kbd && (
          <InputGroupAddon align="inline-end" className="uppercase">
            <Kbd>{kbd}</Kbd>
          </InputGroupAddon>
        )}
      </InputGroup>
      <DropdownMenuSeparator />
    </React.Fragment>
  );
}

function DropdownMenuEmpty({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-empty"
      className={cn(
        "text-muted-foreground px-2.5 py-2 text-center text-xs",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 data-[variant=destructive]:data-highlighted:text-destructive data-[variant=destructive]:*:[svg]:text-destructive group/dropdown-menu-item text-xs-plus [&_svg]:text-muted-foreground data-highlighted:[&_svg]:text-accent-foreground relative flex items-center gap-2 rounded-md px-2.5 py-2 leading-4 outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  delay = 0,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      delay={delay}
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground text-xs-plus [&_svg]:text-muted-foreground data-highlighted:[&_svg]:text-accent-foreground data-popup-open:[&_svg]:text-accent-foreground flex items-center gap-2 rounded-md py-2 pr-1 pl-2.5 leading-4 outline-hidden select-none data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        strokeWidth={2}
        className="ml-auto"
      />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 2,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent> & {
  instant?: boolean;
}) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground shadow-popup-border w-auto min-w-24 rounded-lg p-1 transition-none",
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
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
        <MenuPrimitive.CheckboxItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
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
        <MenuPrimitive.RadioItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSearch,
  DropdownMenuEmpty,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
