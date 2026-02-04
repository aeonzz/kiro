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
        maximumTeams: 3,
        allowRemovingAllTeams: false,
        maximumMembersPerTeam: 10,
        defaultTeam: {
          enabled: true,
          customCreateDefaultTeam: async (organization) => {
            const team = await prisma.team.create({
              data: {
                id: crypto.randomUUID(),
                organizationId: organization.id,
                name: organization.name,
                slug: organization.name.slice(0, 3).toUpperCase(),
                createdAt: new Date(),
              },
            });
            return {
              ...team,
              updatedAt: team.updatedAt ?? undefined,
            };
          },
        },
      },
      schema: {
        team: {
          additionalFields: {
            slug: {
              type: "string",
              unique: true,
              required: true,
              input: true,
            },
          },
        },
      },
      organizationHooks: {
        afterCreateTeam: async ({ team, user }) => {
          if (!user) return;

          try {
            await prisma.$transaction([
              prisma.teamMember.create({
                data: {
                  id: crypto.randomUUID(),
                  teamId: team.id,
                  userId: user.id,
                  createdAt: new Date(),
                },
              }),
              prisma.workflowState.createMany({
                data: [
                  {
                    teamId: team.id,
                    name: "Backlog",
                    type: "BACKLOG",
                    position: 1,
                  },
                  {
                    teamId: team.id,
                    name: "Todo",
                    type: "UNSTARTED",
                    position: 2,
                  },
                  {
                    teamId: team.id,
                    name: "In Progress",
                    type: "STARTED",
                    position: 3,
                  },
                  {
                    teamId: team.id,
                    name: "Done",
                    type: "COMPLETED",
                    position: 4,
                  },
                  {
                    teamId: team.id,
                    name: "Canceled",
                    type: "CANCELED",
                    position: 5,
                  },
                ],
              }),
            ]);
          } catch (error) {
            console.error("Failed to setup team:", error);
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to create team members or workflow states.",
            });
          }
        },
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await auth.api.createOrganization({
            body: {
              name: user.name,
              slug: user.name,
              userId: user.id,
            },
          });
        },
      },
    },
  },
});
