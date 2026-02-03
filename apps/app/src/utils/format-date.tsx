import { format, isSameYear, parseISO } from "date-fns";

export function formatDate(date: string) {
  const parsedDate = parseISO(date);
  return isSameYear(parsedDate, new Date())
    ? format(parsedDate, "MMM d")
    : format(parsedDate, "MMM yyyy");
}
