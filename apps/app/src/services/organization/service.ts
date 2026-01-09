import { prisma } from "@kiro/db";

import { auth } from "@/lib/auth";

import type { GetUserOrganization, OrganizationInput } from "./schema";

export async function createOrganizationService({
  data,
  headers,
}: {
  data: OrganizationInput & {
    userId: string;
  };
  headers: Headers;
}) {
  const response = await auth.api.createOrganization({
    body: {
      ...data,
    },
    headers,
  });

  return response;
}

export async function getOrganizationService({
  userId,
  slug,
}: {
  userId: string;
  slug: GetUserOrganization["slug"];
}) {
  try {
    const organization = await prisma.organization.findFirst({
      where: {
        slug,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        teams: true,
        invitations: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!organization) {
      return null;
    }

    const userRole = organization.members.find(
      (m) => m.userId === userId
    )?.role;

    return {
      ...organization,
      userRole,
    };
  } catch (error) {
    throw new Error("Failed to get organization");
  }
}
