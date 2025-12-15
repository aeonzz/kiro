import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@kiro/db";
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
  plugins: [tanstackStartCookies()],
});
