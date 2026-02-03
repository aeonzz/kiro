import * as React from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

import type { IconType } from "@/types/inbox";

// Helper component to render both HugeIcons and custom icon components
export interface IconComponentProps {
  icon: IconType;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export function Icon({
  icon,
  strokeWidth = 2,
  className,
  color,
  style,
}: IconComponentProps) {
  const iconStyle = color ? { color, ...style } : style;

  if (Array.isArray(icon)) {
    return (
      <HugeiconsIcon
        icon={icon as IconSvgElement}
        strokeWidth={strokeWidth}
        className={className}
        style={iconStyle}
      />
    );
  }

  const CustomIcon = icon as React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  return <CustomIcon size={18} className={className} style={iconStyle} />;
}
