import { TeamMember, Team as TeamType, User } from "@kiro/db";

export type Team = TeamType & {
  teammembers: (TeamMember & {
    user: User;
  })[];
};
