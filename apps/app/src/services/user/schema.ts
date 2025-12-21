import * as z from "zod";

import { FontSizeValue } from "@/types/font";

export const setUserPreferencesInput = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  cursorPointer: z.boolean().optional(),
  fontSize: z.enum(FontSizeValue).optional(),
});

export type SetUserPreferencesInput = z.infer<typeof setUserPreferencesInput>;
