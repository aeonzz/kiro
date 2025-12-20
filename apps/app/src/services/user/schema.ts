import * as z from "zod";

export const setUserPreferencesInput = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  cursorPointer: z.boolean().optional(),
});

export type SetUserPreferencesInput = z.infer<typeof setUserPreferencesInput>;
