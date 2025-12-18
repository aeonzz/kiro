import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

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

export function resolveOrgUrl(url: string, organizationSlug?: string) {
  return url.replace("$organization", organizationSlug || "");
}

export function isNavLinkActive(
  pathname: string,
  url: string,
  organizationSlug?: string
) {
  return decodeURIComponent(pathname) === resolveOrgUrl(url, organizationSlug);
}
