import { prisma } from "@kiro/db";
import { generateId } from "better-auth";

import type { CreateTeamSchemaType, GetTeamByIdSchemaType } from "./schema";

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
  } catch (err) {
    throw err;
  }
}

export async function getTeamByIdService({
  slug,
  organizationSlug,
}: GetTeamByIdSchemaType) {
  try {
    return await prisma.team.findFirst({
      where: {
        slug,
        organization: {
          slug: organizationSlug,
        },
      },
    });
  } catch (err) {
    throw err;
  }
}
