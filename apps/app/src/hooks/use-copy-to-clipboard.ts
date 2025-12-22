import * as React from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const copy = React.useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success("Copied to clipboard");
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy] as const;
}
