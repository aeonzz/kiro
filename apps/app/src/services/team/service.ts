import { prisma } from "@kiro/db";

import { auth } from "@/lib/auth";

import type {
  CreateTeamSchemaType,
  GetTeamByIdSchemaType,
  GetTeamsSchemaType,
  UpdateTeamSchemaType,
} from "./schema";

export async function createTeamService(
  data: CreateTeamSchemaType,
  headers: Headers
) {
  try {
    return await auth.api.createTeam({
      body: { ...data },
      headers,
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
