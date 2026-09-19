import {
  format,
  formatDistanceToNowStrict,
  isSameYear,
  parseISO,
} from "date-fns";

export function formatDate(date: string) {
  const parsedDate = parseISO(date);
  return isSameYear(parsedDate, new Date())
    ? format(parsedDate, "MMM d")
    : format(parsedDate, "MMM yyyy");
}

const RELATIVE_UNIT_ABBREVIATIONS: Record<string, string> = {
  second: "s",
  minute: "m",
  hour: "h",
  day: "d",
  week: "w",
  month: "mo",
  year: "y",
};

/** "8 weeks" -> "8w ago", matching Linear's compact activity timestamps. */
export function formatShortRelativeTime(iso: string): string {
  const distance = formatDistanceToNowStrict(new Date(iso));
  const [value, unit] = distance.split(" ");
  const abbreviation =
    RELATIVE_UNIT_ABBREVIATIONS[unit.replace(/s$/, "")] ?? unit;
  return `${value}${abbreviation} ago`;
}
