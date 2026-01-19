import type {
  Invitation,
  Member,
  Notification as NotificationType,
  Organization as OrganizationType,
  TeamMember,
  Team as TeamType,
  User,
} from "@kiro/db";

import type { StrictOmit } from ".";
import type { RoutePath } from "./route-type";

export type Team = StrictOmit<TeamType, "updatedAt"> & {
  teammembers: Array<
    TeamMember & {
      user: User;
    }
  >;
  updatedAt?: Date;
};

export type Organization = OrganizationType & {
  members: Array<
    Member & {
      user: User;
    }
  >;
  teams: Team[];
  invitations: Array<
    Invitation & {
      user: User;
    }
  >;
};

export type Notification = StrictOmit<NotificationType, "link"> & {
  user: User;
  organization: OrganizationType;
  actor: User | null;
  link: RoutePath;
};
