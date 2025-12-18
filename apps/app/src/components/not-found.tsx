import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function NotFound({ children }: { children?: any }) {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={AlertCircleIcon} />
        </EmptyMedia>
        <EmptyTitle>Page Not Found</EmptyTitle>
        <EmptyDescription>
          {children || "The page you are looking for does not exist."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
