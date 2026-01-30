import * as React from "react";
import type { StrictOmit } from "@/types";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CopyButton({
  value,
  size = "icon-xs",
  variant = "ghost",
  ...props
}: { value: (() => string) | string } & StrictOmit<
  React.ComponentProps<typeof Button>,
  "value"
>) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={size}
            variant={variant}
            onClick={() => {
              void navigator.clipboard.writeText(
                typeof value === "function" ? value() : value
              );
              setHasCopied(true);
            }}
            {...props}
          />
        }
      >
        <span className="sr-only">Copy</span>
        {hasCopied ? (
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        ) : (
          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
        )}
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>Copy content</span>
      </TooltipContent>
    </Tooltip>
  );
}
