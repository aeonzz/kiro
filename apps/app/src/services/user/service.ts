import { prisma } from "@kiro/db";

import { flattenPrefs } from "../utils";
import { SetUserPreferencesInput } from "./schema";

export async function getUserPreferencesService({
  userId,
}: {
  userId: string;
}): Promise<SetUserPreferencesInput> {
  try {
    const preferences = await prisma.userPreference.findMany({
      where: {
        userId,
      },
    });

    return preferences.reduce((acc, pref) => {
      acc[pref.key as keyof SetUserPreferencesInput] = pref.value as any;
      return acc;
    }, {} as SetUserPreferencesInput);
  } catch (error) {
    throw new Error("Failed to get user preferences");
  }
}

export async function setUserPreferencesService({
  userId,
  data,
}: {
  userId: string;
  data: SetUserPreferencesInput;
}) {
  try {
    const prefs = flattenPrefs(data);

    const results = await Promise.all(
      prefs.map(({ key, value }) =>
        prisma.userPreference.upsert({
          where: {
            userId_key: {
              userId,
              key: key,
            },
          },
          create: {
            userId,
            key,
            value: value as any,
          },
          update: {
            value: value as any,
          },
        })
      )
    );

    return results;
  } catch (error) {
    throw new Error("Failed to get set preferences");
  }
}
