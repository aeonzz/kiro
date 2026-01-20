import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  type BadgeStyleOption,
  type NavItem,
  type VisibilityOption,
} from "@/types/sidebar";
import {
  NavItemVisibility,
  sidebarMenuItems,
  sidebarWorkspaceItems,
  visibilityOptions,
} from "@/config/nav";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/hooks/use-preference-store";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const sidebarCustomizationHandle = DialogPrimitive.createHandle();

const badgeStyles: BadgeStyleOption[] = [
  {
    value: "count",
    label: "Count",
    icon: (
      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-sm bg-[color-mix(in_oklab,var(--accent)90%,var(--accent-foreground))]">
        <div className="text-micro-plus -ml-px leading-0 tracking-tighter">
          1
        </div>
      </span>
    ),
  },
  {
    value: "dot",
    label: "Dot",
    icon: (
      <span className="flex size-4.5 shrink-0 items-center justify-center rounded-sm">
        <div className="text-micro-plus -ml-px size-2.5 rounded-full bg-[color-mix(in_oklab,var(--accent)80%,var(--accent-foreground))]" />
      </span>
    ),
  },
];

export function SidebarControl({
  handle = sidebarCustomizationHandle,
  ...props
}: React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog handle={handle} {...props}>
      <DialogContent className="h-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Customize sidebar</DialogTitle>
          <DialogDescription className="sr-only">
            Customize sidebar
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="shadow-border-sm bg-card flex items-center justify-start gap-4 rounded-md px-3 py-2.5">
            <h4 className="text-xs-plus flex-1 font-medium">
              Default badge style
            </h4>
            <div className="flex flex-1 items-center justify-end">
              <Select defaultValue={badgeStyles[0]}>
                <SelectTrigger className="min-w-[120px]" variant="ghost">
                  <SelectValue>
                    {(value: BadgeStyleOption) => (
                      <>
                        {value.icon}
                        <span className="ml-0.5 leading-none">
                          {value.label}
                        </span>
                      </>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {badgeStyles.map((badgeStyle) => (
                      <SelectItem key={badgeStyle.value} value={badgeStyle}>
                        <span>{badgeStyle.icon}</span>
                        <span>{badgeStyle.label}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xs-plus flex-1 font-medium">Personal</h3>
            <div className="shadow-border-sm bg-card flex h-auto items-center justify-start gap-4 rounded-md px-3 py-2.5">
              <ul className="flex flex-1 flex-col gap-2">
                {sidebarMenuItems.map((item) => (
                  <Item key={item.title} item={item} />
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xs-plus flex-1 font-medium">Workspace</h3>
            <div className="shadow-border-sm bg-card flex h-auto items-center justify-start gap-4 rounded-md px-3 py-2.5">
              <ul className="flex flex-1 flex-col gap-2">
                {sidebarWorkspaceItems.map((item) => (
                  <Item key={item.title} item={item} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ItemProps extends React.ComponentProps<"li"> {
  item: NavItem;
}

function Item({ item, className, ...props }: ItemProps) {
  const sidebarConfig = usePreferencesStore((state) => state.sidebarConfig);
  const setSidebarConfig = usePreferencesStore(
    (state) => state.setSidebarConfig
  );
  const { mutateAsync } = useUserPreferences();

  const currentVisibility =
    sidebarConfig[item.title] ?? item.visibility ?? NavItemVisibility.Show;

  const currentOption =
    visibilityOptions.find((o) => o.value === currentVisibility) ||
    visibilityOptions[0];

  const handleVisibilityChange = (value: VisibilityOption | null) => {
    if (!value) return;
    const newVisibility = value.value as NavItemVisibility;
    setSidebarConfig(item.title, newVisibility);
    try {
      mutateAsync({
        sidebarConfig: {
          ...sidebarConfig,
          [item.title]: newVisibility,
        },
      });
    } catch {}
  };

  return (
    <li
      className={cn(
        "[&_svg]:text-muted-foreground flex items-center gap-4 [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-1 items-center gap-2",
          currentVisibility === NavItemVisibility.Hide && "opacity-50"
        )}
      >
        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
        <p className="text-xs-plus flex-1 font-normal">{item.title}</p>
      </div>
      <div className="flex flex-1 items-center justify-end">
        <Select
          value={currentOption}
          itemToStringValue={(item) => item.value}
          onValueChange={handleVisibilityChange}
        >
          <SelectTrigger className="min-w-[120px]" variant="ghost">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto">
            <SelectGroup>
              {visibilityOptions
                .filter(
                  (option) =>
                    !item.disabledVisibilityOptions?.includes(
                      option.value as NavItemVisibility
                    )
                )
                .map((option) => (
                  <SelectItem key={option.value} value={option}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </li>
  );
}
