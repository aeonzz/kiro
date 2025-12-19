import { prisma } from "@kiro/db";
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  socialProviders: {
    github: {
      prompt: "select_account",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    tanstackStartCookies(),
    organization({
      teams: {
        enabled: true,
        maximumTeams: 10,
        allowRemovingAllTeams: false,
      },
      // organizationHooks: {
      //   afterCreateOrganization: async ({ organization }) => {
      //     try {
      //       await auth.api.createTeam({
      //         body: {
      //           organizationId: organization.id,
      //           name: organization.name,
      //         },
      //       });
      //     } catch (error) {
      //       throw new APIError("INTERNAL_SERVER_ERROR", {
      //         message: "Failed to create team",
      //       });
      //     }
      //   },
      // },
    }),
  ],
});
