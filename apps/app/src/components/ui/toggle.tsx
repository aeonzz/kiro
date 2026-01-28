import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 gap-1 rounded-lg text-xs font-medium transition-all [&_svg:not([class*='size-'])]:size-4 group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "hover:not-data-pressed:shadow-[0_0_0_1px_var(--accent)]/50 hover:bg-accent data-pressed:bg-accent data-pressed:text-accent-foreground data-pressed:shadow-[0_0_0_1px_var(--accent)] hover:not-data-pressed:bg-accent/50 hover:text-accent-foreground",
        secondary:
          "hover:not-data-pressed:shadow-[0_0_0_1px_var(--accent)]/50 data-pressed:bg-[color-mix(in_oklab,var(--accent)98%,var(--accent-foreground))] data-pressed:text-accent-foreground data-pressed:shadow-[0_0_0_1px_var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)98%,var(--accent-foreground))] hover:text-accent-foreground",
        outline:
          "shadow-border-sm hover:not-data-pressed:bg-accent/50 bg-transparent data-pressed:bg-accent data-pressed:text-accent-foreground hover:text-accent-foreground",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2 text-xs",
        xs: "h-6 min-w-6 rounded-[min(var(--radius-md),10px)] px-2 text-xs",
        lg: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
