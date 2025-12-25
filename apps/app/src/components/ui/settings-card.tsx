import * as React from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

function SettingsGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-group"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

function SettingsGroupTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="settings-group-title"
      className={cn("text-foreground text-sm", className)}
      {...props}
    />
  );
}

function SettingsCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="settings-card"
      className={cn("gap-0 overflow-hidden p-0", className)}
      {...props}
    />
  );
}

function SettingsItem({
  className,
  render,
  ...props
}: React.ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="settings-item"
      variant="outline"
      render={render}
      className={cn(
        "border-border items-center gap-4 rounded-none border-0 border-b px-4 py-4 last:border-0 hover:bg-transparent [a]:hover:bg-[color-mix(in_oklab,var(--card)95%,var(--card-foreground))]",
        "data-[invalid=true]:text-destructive",
        className
      )}
      {...props}
    />
  );
}

function SettingsItemContent({
  className,
  ...props
}: React.ComponentProps<typeof ItemContent>) {
  return (
    <ItemContent
      data-slot="settings-item-content"
      className={cn(
        "gap-1.5 *:data-[slot=field-error]:leading-none",
        className
      )}
      {...props}
    />
  );
}

function SettingsItemTitle({
  className,
  ...props
}: React.ComponentProps<typeof ItemTitle>) {
  return (
    <ItemTitle
      data-slot="settings-item-title"
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  );
}

function SettingsItemDescription({
  className,
  ...props
}: React.ComponentProps<typeof ItemDescription>) {
  return (
    <ItemDescription
      data-slot="settings-item-description"
      className={cn("text-xs leading-none", className)}
      {...props}
    />
  );
}

function SettingsItemControl({
  className,
  ...props
}: React.ComponentProps<typeof ItemActions>) {
  return (
    <ItemActions
      data-slot="settings-item-control"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  );
}

function SettingsItemMedia({
  className,
  ...props
}: React.ComponentProps<typeof ItemMedia>) {
  return (
    <ItemMedia
      data-slot="settings-item-media"
      className={cn("text-muted-foreground rounded-lg", className)}
      {...props}
    />
  );
}

export {
  SettingsGroup,
  SettingsGroupTitle,
  SettingsCard,
  SettingsItem,
  SettingsItemContent,
  SettingsItemTitle,
  SettingsItemDescription,
  SettingsItemMedia,
  SettingsItemControl,
};
