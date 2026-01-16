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

export type Notification = StrictOmit<NotificationType, "link"> & {
  user: User;
  organization: OrganizationType;
  actor: User | null;
  link: RoutePath;
};
