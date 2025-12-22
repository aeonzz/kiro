import * as z from "zod";

import { NavItemVisibility } from "@/config/nav";
import { FontSizeValue, HomeViewValue } from "@/config/preferences";

export const setUserPreferencesInput = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  cursorPointer: z.boolean().optional(),
  fontSize: z.enum(FontSizeValue).optional(),
  sidebarConfig: z.record(z.string(), z.enum(NavItemVisibility)).optional(),
  workspaceOpen: z.boolean().optional(),
  teamsOpen: z.boolean().optional(),
  homeView: z.enum(HomeViewValue).optional(),
});

export type SetUserPreferencesInput = z.infer<typeof setUserPreferencesInput>;
