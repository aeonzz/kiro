import type {
  Invitation,
  Member,
  Organization as OrganizationType,
  TeamMember,
  Team as TeamType,
  User,
} from "@kiro/db";

export type Team = TeamType & {
  teammembers: (TeamMember & {
    user: User;
  })[];
};

export type Organization = OrganizationType & {
  members: (Member & {
    user: User;
  })[];
  teams: Team[];
  invitations: (Invitation & {
    user: User;
  })[];
};
