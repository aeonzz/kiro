import type {
  Invitation,
  IssueDraft as IssueDraftType,
  Member as MemberType,
  Notification as NotificationType,
  Organization as OrganizationType,
  Project,
  TeamMember,
  Team as TeamType,
  User,
  WorkflowState,
} from "@kiro/db";

import type { StrictOmit } from ".";
import type { RoutePath } from "./route-type";

export type Team = StrictOmit<TeamType, "updatedAt"> & {
  teammembers: Array<
    TeamMember & {
      user: User;
    }
  >;
  updatedAt: Date | null;
  workflowStates: Array<WorkflowState>;
  projects: Array<Project>;
};

export type Organization = OrganizationType & {
  members: Array<Member>;
  teams: Team[];
  invitations: Array<
    Invitation & {
      user: User;
    }
  >;
};

export type Member = MemberType & {
  user: User;
};

export type Notification = StrictOmit<NotificationType, "link"> & {
  user: User;
  organization: OrganizationType;
  actor: User | null;
  link: RoutePath;
};

export type IssueDraft = IssueDraftType;
