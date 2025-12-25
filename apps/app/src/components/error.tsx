import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function Error({
  error,
  reset,
  className,
}: {
  error?: unknown;
  reset?: () => void;
  className?: string;
}) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={AlertCircleIcon} />
        </EmptyMedia>
        <EmptyTitle>Something went wrong</EmptyTitle>
        <EmptyDescription>
          {error instanceof Error
            ? (error as Error).message
            : typeof error === "string"
              ? error
              : "An unexpected error occurred."}
        </EmptyDescription>
        {reset && (
          <div className="pt-2">
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
          </div>
        )}
      </EmptyHeader>
    </Empty>
  );
}
