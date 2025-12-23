import { prisma } from "@kiro/db";
import { generateId } from "better-auth";

import type { CreateTeamSchemaType } from "./schema";

export async function createTeamService({
  userId,
  data,
}: {
  userId: string;
  data: CreateTeamSchemaType;
}) {
  try {
    return await prisma.team.create({
      data: {
        id: generateId(),
        createdAt: new Date(),
        teammembers: {
          create: {
            id: generateId(),
            createdAt: new Date(),
            userId,
          },
        },
        ...data,
      },
    });
  } catch (error) {
    throw new Error("Failed to create team");
  }
}
