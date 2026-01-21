import * as React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

import type { IconType } from "@/types/inbox";

// Helper component to render both HugeIcons and custom icon components
export function FilterIcon({
  icon,
  strokeWidth = 2,
  className,
}: {
  icon: IconType;
  strokeWidth?: number;
  className?: string;
}) {
  // Check if it's a HugeIcon (IconSvgElement) or a custom component
  // HugeIcons are arrays, custom components are functions
  if (Array.isArray(icon)) {
    return (
      <HugeiconsIcon
        icon={icon as IconSvgElement}
        strokeWidth={strokeWidth}
        className={className}
      />
    );
  }

  const Icon = icon as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  return <Icon size={18} className={className} />;
}
