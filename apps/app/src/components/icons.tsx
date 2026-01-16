import * as React from "react";

import { cn } from "@/lib/utils";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

export const BacklogIcon = ({
  className,
  size = 18,
  ref,
  ...props
}: IconProps) => (
  <svg
    ref={ref}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10.5"
      stroke="currentColor"
      strokeWidth="3"
      strokeDasharray="3 3"
      fill="none"
    />
  </svg>
);

export const TodoIcon = ({
  className,
  size = 18,
  ref,
  ...props
}: IconProps) => (
  <svg
    ref={ref}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10.5"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

export const InProgressIcon = ({
  className,
  size = 18,
  ref,
  ...props
}: IconProps) => (
  <svg
    ref={ref}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10.5"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M12 4.5C16.1421 4.5 19.5 7.8579 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5V4.5Z"
      fill="currentColor"
    />
  </svg>
);

export const InReviewIcon = ({
  className,
  size = 18,
  ref,
  ...props
}: IconProps) => (
  <svg
    ref={ref}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10.5"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M12 12L12 4.5C16.1421 4.5 19.5 7.8579 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.8579 19.5 4.5 16.1421 4.5 12Z"
      fill="currentColor"
    />
  </svg>
);

export const DoneIcon = ({
  className,
  size = 18,
  ref,
  ...props
}: IconProps) => (
  <svg
    ref={ref}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path
      d="M7 12.5L10.5 16L17 8"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CancelledIcon = ({
  className,
  size = 18,
  ref,
  ...props
}: IconProps) => (
  <svg
    ref={ref}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path
      d="M8 8L16 16M16 8L8 16"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
