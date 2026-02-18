import { prisma } from "@kiro/db";

import type {
  CreateProjectSchemaType,
  GetOrganizationProjectSchemaType,
} from "./schema";

export async function getOrganizationProjectsService({
  userId,
  organizationSlug,
}: {
  userId: string;
  organizationSlug: GetOrganizationProjectSchemaType["slug"];
}) {
  try {
    return await prisma.project.findMany({
      where: {
        organization: {
          slug: organizationSlug,
          members: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        issues: true,
        links: true,
        updates: true,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function createProjectService({
  data,
}: {
  data: CreateProjectSchemaType;
}) {
  try {
    return await prisma.project.create({
      data: {
        ...data,
        slug: `${data.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "")}-${crypto.randomUUID()}`,
      },
    });
  } catch (err) {
    throw err;
  }
}
