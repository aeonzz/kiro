import * as React from "react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "@tanstack/react-router";

import { RoutePath } from "@/types/route-type";

import { Button } from "./ui/button";
import { Kbd } from "./ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type BackButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  fallbackPath?: RoutePath;
  to?: RoutePath;
};

/**
 * A back navigation button component that wraps the base Button.
 *
 * Uses browser history to navigate back. If no history exists,
 * navigates to the specified fallback path.
 *
 * If `to` is provided, it will always navigate to that path, overriding
 * the history behavior.
 *
 * @param fallbackPath - Path to navigate to if no history exists (default: "/")
 * @param to - Specific path to navigate to, overriding history behavior
 * @param children - Custom content to display instead of the default back icon
 * @param variant - Button variant (default: "ghost")
 * @param size - Button size (default: "icon")
 *
 * @example
 * ```tsx
 * // Basic usage with default icon
 * <BackButton />
 *
 * // With custom fallback
 * <BackButton fallbackPath="/dashboard" />
 *
 * // With forced destination
 * <BackButton to="/settings" />
 *
 * // With custom content
 * <BackButton variant="outline" size="sm">Go Back</BackButton>
 * ```
 */
export function BackButton({
  fallbackPath = "/$organization/inbox",
  to,
  children,
  variant = "ghost",
  size,
  showTooltip = true,
  ...props
}: BackButtonProps & { showTooltip?: boolean }) {
  const router = useRouter();

  const handleBack = () => {
    if (to) {
      router.navigate({ to });
      return;
    }

    if (window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: fallbackPath });
    }
  };

  const button = (
    <Button
      data-slot="back-button"
      onClick={handleBack}
      variant={variant}
      size={size ?? (children ? "default" : "icon")}
      {...props}
    >
      {children ?? (
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          className="text-muted-foreground"
        />
      )}
      <span className="sr-only">Go Back</span>
    </Button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger data-slot="back-button" render={button}>
        {children ?? (
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="text-muted-foreground"
          />
        )}
        <span className="sr-only">Go Back</span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <span>Go Back</span>
          <Kbd>esc</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
