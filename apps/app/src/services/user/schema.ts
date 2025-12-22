import * as z from "zod";

import { FontSizeValue } from "@/types/font";
import { NavItemVisibility } from "@/config/nav";

export const setUserPreferencesInput = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  cursorPointer: z.boolean().optional(),
  fontSize: z.enum(FontSizeValue).optional(),
  sidebarConfig: z
    .record(z.string(), z.nativeEnum(NavItemVisibility))
    .optional(),
});

export type SetUserPreferencesInput = z.infer<typeof setUserPreferencesInput>;
