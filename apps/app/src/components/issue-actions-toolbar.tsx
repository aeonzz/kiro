import { Copy01Icon, Link02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import { Button } from "./ui/button";

/** Copy-link / copy-ID actions shown in the issue detail header. */
export function IssueActionsToolbar({ identifier }: { identifier: string }) {
  const [, copy] = useCopyToClipboard();

  return (
    <div className="flex items-center gap-2.5">
      <Button
        size="icon-xs"
        variant="outline"
        tooltip="Copy issue link"
        onClick={() => copy(window.location.href, "Copied issue link to clipboard")}
      >
        <HugeiconsIcon icon={Link02Icon} strokeWidth={2} />
      </Button>
      <Button
        size="icon-xs"
        variant="outline"
        tooltip="Copy issue ID"
        onClick={() => copy(identifier, `"${identifier}" copied to clipboard`)}
      >
        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
      </Button>
    </div>
  );
}
