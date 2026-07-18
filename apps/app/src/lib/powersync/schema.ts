import { column, Schema, Table } from "@powersync/web";

/**
 * PowerSync client schema — the local SQLite mirror of the Postgres tables the
 * app syncs. Table keys/names match the Postgres `@@map` names so the sync
 * rules line up 1:1.
 *
 * Conventions (PowerSync + SQLite):
 * - Every table has an implicit `id` TEXT primary key — do NOT declare it.
 * - Type mapping from Postgres: enum/uuid/timestamp -> TEXT, Int -> INTEGER,
 *   Float -> REAL, Boolean -> INTEGER (0/1), Json -> TEXT (stringified).
 * - Columns are nullable client-side; server/schema enforces real constraints.
 */

// Mirrors Postgres `issue` (@@map("issue")).
const issue = new Table(
  {
    number: column.integer,
    title: column.text,
    description: column.text, // JSON stored as text — parse on read
    priority: column.text, // IssuePriority enum
    teamId: column.text,
    creatorId: column.text,
    assigneeId: column.text,
    stateId: column.text,
    parentId: column.text,
    projectId: column.text,
    cycleId: column.text,
    position: column.real,
    createdAt: column.text,
    updatedAt: column.text,
  },
  {
    indexes: {
      team: ["teamId"],
      state: ["stateId"],
      project: ["projectId"],
    },
  }
);

// Mirrors Postgres `workflow_state` (@@map("workflow_state")).
const workflow_state = new Table(
  {
    name: column.text,
    color: column.text,
    icon: column.text,
    type: column.text, // WorkflowType enum
    description: column.text,
    position: column.real,
    isDefault: column.integer, // boolean 0/1
    teamId: column.text,
    createdAt: column.text,
    updatedAt: column.text,
  },
  { indexes: { team: ["teamId"] } }
);

// Mirrors Postgres `issue_label` (@@map("issue_label")).
const issue_label = new Table(
  {
    name: column.text,
    color: column.text,
    description: column.text,
    teamId: column.text,
    createdAt: column.text,
    updatedAt: column.text,
  },
  { indexes: { team: ["teamId"] } }
);

// Join table for the Issue <-> IssueLabel many-to-many (Prisma model
// `IssueLabelLink`, @@map("issue_label_link")).
const issue_label_link = new Table(
  {
    issueId: column.text,
    labelId: column.text,
  },
  { indexes: { issue: ["issueId"], label: ["labelId"] } }
);

// Mirrors Postgres `team` (@@map("team")). Synced so team metadata (name,
// slug -> id resolution) is available locally/offline.
const team = new Table(
  {
    name: column.text,
    slug: column.text,
    organizationId: column.text,
    createdAt: column.text,
    updatedAt: column.text,
  },
  { indexes: { organization: ["organizationId"], slug: ["slug"] } }
);

// Mirrors Postgres `organization` (@@map("organization")). Synced so the org
// (identity + branding) resolves locally/offline without the server list query.
const organization = new Table(
  {
    name: column.text,
    slug: column.text,
    logo: column.text,
    metadata: column.text, // JSON stored as text
    createdAt: column.text,
  },
  { indexes: { slug: ["slug"] } }
);

// Mirrors Postgres `member` (@@map("member")). Synced so org membership + roles
// (used for `userRole` / owner checks) resolve locally.
const member = new Table(
  {
    organizationId: column.text,
    userId: column.text,
    role: column.text,
    createdAt: column.text,
  },
  { indexes: { organization: ["organizationId"], user: ["userId"] } }
);

// Mirrors Postgres `user` (@@map("user")). Only the fields the UI shows for a
// member (name/email/avatar) are synced. Scope sync rules to co-members of the
// signed-in user's orgs — do NOT sync the whole user table.
const user = new Table({
  name: column.text,
  email: column.text,
  image: column.text,
  emailVerified: column.integer, // boolean 0/1
  createdAt: column.text,
  updatedAt: column.text,
});

// Mirrors Postgres `project` (@@map("project")).
const project = new Table(
  {
    name: column.text,
    summary: column.text,
    slug: column.text,
    icon: column.text,
    color: column.text,
    status: column.text, // ProjectStatus enum
    priority: column.text, // IssuePriority enum
    leadId: column.text,
    teamId: column.text,
    organizationId: column.text,
    startDate: column.text,
    targetDate: column.text,
    createdAt: column.text,
    updatedAt: column.text,
  },
  { indexes: { team: ["teamId"], organization: ["organizationId"] } }
);

export const AppSchema = new Schema({
  issue,
  workflow_state,
  issue_label,
  issue_label_link,
  team,
  organization,
  member,
  user,
  project,
});

// Row types inferred from the schema, for use across the app.
export type Database = (typeof AppSchema)["types"];
export type IssueRecord = Database["issue"];
export type WorkflowStateRecord = Database["workflow_state"];
export type IssueLabelRecord = Database["issue_label"];
export type IssueLabelLinkRecord = Database["issue_label_link"];
export type TeamRecord = Database["team"];
export type OrganizationRecord = Database["organization"];
export type MemberRecord = Database["member"];
export type UserRecord = Database["user"];
export type ProjectRecord = Database["project"];
