import * as React from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";

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
  children,
  ...props
}: React.ComponentProps<typeof Field>) {
  return (
    <Field
      data-slot="settings-item"
      orientation="horizontal"
      className={cn(
        "border-border items-center gap-4 border-b px-4 py-4 last:border-0",
        className
      )}
      {...props}
    >
      {children}
    </Field>
  );
}

function SettingsItemContent({
  className,
  ...props
}: React.ComponentProps<typeof FieldContent>) {
  return (
    <FieldContent
      data-slot="settings-item-content"
      className={cn("gap-1.5", className)}
      {...props}
    />
  );
}

function SettingsItemTitle({
  className,
  ...props
}: React.ComponentProps<typeof FieldTitle>) {
  return (
    <FieldTitle
      data-slot="settings-item-title"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

function SettingsItemDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldDescription>) {
  return (
    <FieldDescription
      data-slot="settings-item-description"
      className={cn("text-muted-foreground text-xs leading-none", className)}
      {...props}
    />
  );
}

function SettingsItemControl({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="settings-item-control"
      className={cn("flex shrink-0 items-center", className)}
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
  SettingsItemControl,
};
