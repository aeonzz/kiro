import { formatShortRelativeTime } from "@/utils/format-date";
import { differenceInSeconds } from "date-fns";

/** "just now" below a minute old, otherwise the same short relative format
 * activity rows use (e.g. "8w ago"). */
export function formatCommentTime(iso: string): string {
  if (differenceInSeconds(Date.now(), new Date(iso)) < 60) return "just now";
  return formatShortRelativeTime(iso);
}
