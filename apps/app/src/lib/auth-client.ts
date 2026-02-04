import {
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    organizationClient({
      teams: {
        enabled: true,
      },
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});
