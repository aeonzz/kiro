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
    return await prisma.organization.findFirst({
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
      },
    });
  } catch (error) {
    throw new Error("Failed to get organization");
  }
}
