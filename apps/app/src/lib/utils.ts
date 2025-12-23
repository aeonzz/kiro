import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { RoutePath } from "@/types/route-type";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-micro",
        "text-micro-plus",
        "text-xs-plus",
        "text-sm-plus",
        "text-base-plus",
        "text-lg-plus",
        "text-xl-plus",
        "text-2xl-plus",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveOrgUrl(
  url: RoutePath,
  organizationSlug?: string,
  teamSlug?: string
) {
  return url
    .replace("$organization", organizationSlug || "")
    .replace("$team", teamSlug || "")
    .replace("$name", teamSlug || "");
}

export function isNavLinkActive(
  pathname: string,
  url: RoutePath,
  organizationSlug?: string,
  teamSlug?: string
) {
  return (
    decodeURIComponent(pathname) ===
    resolveOrgUrl(url, organizationSlug, teamSlug)
  );
}
