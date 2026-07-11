import { prisma } from "@kiro/db";

import { auth } from "@/lib/auth";

import type {
  CreateWorkflowStateSchemaType,
  DeleteWorkflowStateSchemaType,
  CreateTeamSchemaType,
  GetTeamByIdSchemaType,
  GetTeamsSchemaType,
  ReorderWorkflowStatesSchemaType,
  UpdateTeamSchemaType,
  UpdateWorkflowStateSchemaType,
} from "./schema";

const defaultWorkflowStateTypes = new Set(["BACKLOG", "UNSTARTED"]);

function canBeDefaultWorkflowState(type: string) {
  return defaultWorkflowStateTypes.has(type);
}

export async function createTeamService(
  data: CreateTeamSchemaType,
  headers: Headers
) {
  try {
    return await auth.api.createTeam({
      body: { ...data },
      headers,
    });
  } catch (err) {
    throw err;
  }
}

export async function getTeamByIdService({
  slug,
  organizationSlug,
}: GetTeamByIdSchemaType) {
  try {
    return await prisma.team.findFirst({
      where: {
        slug,
        organization: {
          slug: organizationSlug,
        },
      },
      include: {
        teammembers: {
          include: {
            user: true,
          },
        },
        workflowStates: {
          orderBy: {
            position: "asc",
          },
          include: {
            _count: {
              select: {
                issues: true,
              },
            },
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function updateTeamService({
  id,
  payload: data,
}: UpdateTeamSchemaType) {
  try {
    return await prisma.team.update({
      where: { id },
      data,
      include: {
        teammembers: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
}

export function deleteTeamService({ id }: { id: string }) {
  try {
    return prisma.team.delete({
      where: { id },
    });
  } catch (err) {
    throw err;
  }
}

export async function createWorkflowStateService({
  teamId,
  description,
  isDefault = false,
  ...data
}: CreateWorkflowStateSchemaType) {
  try {
    if (isDefault && !canBeDefaultWorkflowState(data.type)) {
      throw new Error("Only backlog and unstarted statuses can be defaults.");
    }

    const aggregate = await prisma.workflowState.aggregate({
      where: { teamId },
      _max: {
        position: true,
      },
    });

    return prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.workflowState.updateMany({
          where: {
            teamId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.workflowState.create({
        data: {
          ...data,
          teamId,
          description: description?.trim() || null,
          isDefault,
          position: (aggregate._max.position ?? 0) + 1,
        },
        include: {
          _count: {
            select: {
              issues: true,
            },
          },
        },
      });
    });
  } catch (err) {
    throw err;
  }
}

export async function updateWorkflowStateService({
  id,
  description,
  isDefault,
  ...data
}: UpdateWorkflowStateSchemaType) {
  try {
    const currentState = await prisma.workflowState.findUnique({
      where: { id },
      select: {
        teamId: true,
        type: true,
      },
    });

    if (!currentState) {
      throw new Error("Workflow state not found.");
    }

    if (isDefault && !canBeDefaultWorkflowState(currentState.type)) {
      throw new Error("Only backlog and unstarted statuses can be defaults.");
    }

    return prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.workflowState.updateMany({
          where: {
            teamId: currentState.teamId,
            isDefault: true,
            NOT: {
              id,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.workflowState.update({
        where: { id },
        data: {
          ...data,
          description: description?.trim() || null,
          ...(typeof isDefault === "boolean" ? { isDefault } : null),
        },
        include: {
          _count: {
            select: {
              issues: true,
            },
          },
        },
      });
    });
  } catch (err) {
    throw err;
  }
}

export async function deleteWorkflowStateService({
  id,
}: DeleteWorkflowStateSchemaType) {
  try {
    const state = (await prisma.workflowState.findUnique({
      where: { id },
      select: {
        isDefault: true,
      },
    } as Parameters<typeof prisma.workflowState.findUnique>[0])) as {
      isDefault: boolean;
    } | null;

    if (state?.isDefault) {
      throw new Error("Choose another default status before deleting this one.");
    }

    const issueCount = await prisma.issue.count({
      where: {
        stateId: id,
      },
    });

    if (issueCount > 0) {
      throw new Error("Move issues out of this status before deleting it.");
    }

    return prisma.workflowState.delete({
      where: { id },
    });
  } catch (err) {
    throw err;
  }
}

export async function reorderWorkflowStatesService({
  teamId,
  type,
  stateIds,
}: ReorderWorkflowStatesSchemaType) {
  try {
    const states = await prisma.workflowState.findMany({
      where: {
        teamId,
        type,
      },
      select: {
        id: true,
      },
    });

    const stateIdSet = new Set(states.map((state) => state.id));

    if (
      states.length !== stateIds.length ||
      stateIds.some((stateId) => !stateIdSet.has(stateId))
    ) {
      throw new Error("Workflow state order is out of date.");
    }

    return prisma.$transaction(
      stateIds.map((stateId, index) =>
        prisma.workflowState.update({
          where: { id: stateId },
          data: {
            position: index + 1,
          },
        })
      )
    );
  } catch (err) {
    throw err;
  }
}

export async function getTeamsService({
  organizationSlug,
}: GetTeamsSchemaType) {
  try {
    return await prisma.team.findMany({
      where: {
        organization: {
          slug: organizationSlug,
        },
      },
      include: {
        teammembers: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
}
