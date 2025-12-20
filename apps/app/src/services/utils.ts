import { SetUserPreferencesInput } from "./user/schema";

export function flattenPrefs(input: SetUserPreferencesInput) {
  return Object.entries(input).map(([key, value]) => ({
    key,
    value,
  }));
}
