import { auth } from "@/lib/auth";

import { OrganizationInput } from "./schema";

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
