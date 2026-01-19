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

export const CopyIcon = ({
  className,
  size = 18,
  ref,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    ref={ref}
    width={size}
    height={size}
    fill="none"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("shrink-0", className)}
    {...props}
  >
    <path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" />
    <path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" />
  </svg>
);
