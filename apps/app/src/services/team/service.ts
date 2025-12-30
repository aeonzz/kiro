import { prisma } from "@kiro/db";
import { generateId } from "better-auth";

import type {
  CreateTeamSchemaType,
  GetTeamByIdSchemaType,
  GetTeamsSchemaType,
  UpdateTeamSchemaType,
} from "./schema";

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
      include: {
        teammembers: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function updateTeamService({
  id,
  payload: data,
}: UpdateTeamSchemaType) {
  try {
    return await prisma.team.update({
      where: { id },
      data,
      include: {
        teammembers: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
}

export function deleteTeamService({ id }: { id: string }) {
  try {
    return prisma.team.delete({
      where: { id },
    });
  } catch (err) {
    throw err;
  }
}

export async function getTeamsService({
  organizationSlug,
}: GetTeamsSchemaType) {
  try {
    return await prisma.team.findMany({
      where: {
        organization: {
          slug: organizationSlug,
        },
      },
      include: {
        teammembers: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
}
