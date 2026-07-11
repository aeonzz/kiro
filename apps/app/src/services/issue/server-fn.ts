import authMiddleware from "@/middlewares/auth";
import { prisma } from "@kiro/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getUserOrganizationSchema } from "../organization/schema";
import {
  createIssueSchema,
  getTeamIssuesSchema,
  issueDraftSchema,
  updateIssueSchema,
} from "./schema";
import {
  clearIssueDrafts,
  createIssue,
  deleteIssueDraft,
  getIssueDrafts,
  getTeamIssues,
  saveIssueDraft,
  updateIssue,
} from "./service";

export const createIssueFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(createIssueSchema)
  .handler(async ({ context, data }) => {
    return createIssue({
      userId: context.session.user.id,
      issue: data,
    });
  });

export const getTeamIssuesFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getTeamIssuesSchema)
  .handler(async ({ context, data }) => {
    return getTeamIssues({
      userId: context.session.user.id,
      organizationSlug: data.organizationSlug,
      teamSlug: data.teamSlug,
    });
  });

export const updateIssueFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(updateIssueSchema)
  .handler(async ({ context, data }) => {
    return updateIssue({
      userId: context.session.user.id,
      issue: data,
    });
  });

export const saveIssueDraftFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(issueDraftSchema)
  .handler(async ({ context, data }) => {
    return saveIssueDraft({
      userId: context.session.user.id,
      draft: data,
    });
  });

export const getIssueDraftsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(getUserOrganizationSchema)
  .handler(async ({ context, data }) => {
    const org = await prisma.organization.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (!org) return [];

    const drafts = await getIssueDrafts({
      userId: context.session.user.id,
      organizationId: org.id,
    });

    return drafts;
  });

export const deleteIssueDraftFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ draftId: z.string() }))
  .handler(async ({ context, data }) => {
    return deleteIssueDraft({
      userId: context.session.user.id,
      draftId: data.draftId,
    });
  });

export const clearIssueDraftsFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(getUserOrganizationSchema)
  .handler(async ({ context, data }) => {
    const org = await prisma.organization.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (!org) return;

    return clearIssueDrafts({
      userId: context.session.user.id,
      organizationId: org.id,
    });
  });
