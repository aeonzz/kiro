import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg bg-clip-padding text-xs font-medium focus-visible:ring-1 aria-invalid:ring-1 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-[color,border-color,background-color,opacity,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground aria-expanded:[&_svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "shadow-border-sm bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "shadow-border-sm bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:dark:bg-input/50 aria-expanded:text-foreground",
        flatOutline:
          "bg-transparent border border-border hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground data-activable:text-muted-foreground data-activable:data-active:dark:bg-input/30 data-activable:data-active:text-foreground data-activable:data-active:[&_svg]:text-foreground data-activable:hover:text-foreground",
        secondary:
          "shadow-border-sm bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--secondary)95%,var(--secondary-foreground))] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        muted:
          "shadow-border-sm bg-muted text-foreground/95 aria-expanded:bg-muted aria-expanded:text-foreground/95 hover:text-foreground/95 hover:bg-[color-mix(in_oklab,var(--muted)90%,var(--muted-foreground))] aria-expanded:bg-[color-mix(in_oklab,var(--muted)90%,var(--muted-foreground))]",
        ghost:
          "hover:shadow-[0_0_0_1px_var(--accent)] hover:bg-accent hover:text-foreground dark:hover:bg-accent/70 dark:hover:shadow-[0_0_0_1px_var(--accent)]/70 aria-expanded:bg-accent dark:aria-expanded:bg-accent/70 aria-expanded:text-foreground aria-expanded:shadow-[0_0_0_1px_var(--accent)] dark:aria-expanded:shadow-[0_0_0_1px_var(--accent)]/70",
        ghostPopup:
          "hover:shadow-[0_0_0_1px_var(--accent)] hover:bg-accent hover:text-foreground dark:hover:bg-[color-mix(in_oklab,var(--accent)98%,var(--accent-foreground))] aria-expanded:bg-accent dark:aria-expanded:bg-[color-mix(in_oklab,var(--accent)98%,var(--accent-foreground))] aria-expanded:text-foreground aria-expanded:shadow-[0_0_0_1px_var(--accent)]",
        destructive:
          "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        ghostDestructive:
          "hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1.5 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        sm: "h-7 gap-1.5 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 leading-normal",
        lg: "h-9 text-xs-plus gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  activable,
  isActive,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    activable?: boolean;
    isActive?: boolean;
  }) {
  return (
    <ButtonPrimitive
      data-activable={activable}
      data-slot="button"
      data-active={isActive}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
