import authMiddleware from "@/middlewares/auth";
import { prisma } from "@kiro/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getUserOrganizationSchema } from "../organization/schema";
import { issueDraftSchema } from "./schema";
import {
  clearIssueDrafts,
  deleteIssueDraft,
  getIssueDrafts,
  saveIssueDraft,
} from "./service";

export const saveIssueDraftFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(issueDraftSchema)
  .handler(async ({ context, data }) => {
    return saveIssueDraft({
      userId: context.session.user.id,
      draft: data,
    });
  });

export const getIssueDraftsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(getUserOrganizationSchema)
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
  .inputValidator(z.object({ draftId: z.string() }))
  .handler(async ({ context, data }) => {
    return deleteIssueDraft({
      userId: context.session.user.id,
      draftId: data.draftId,
    });
  });

export const clearIssueDraftsFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(getUserOrganizationSchema)
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
