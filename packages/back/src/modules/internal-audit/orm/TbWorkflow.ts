import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbWorkflow = pgTable(
  "tb_internal_audit_workflows",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    part: text().notNull(),
    highLevelSubject: text().notNull(),
    subject: text().notNull(),
    reviewerUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    questions: text().notNull(),
    necessaries: text().notNull(),
    necessaryProof: text().notNull(),
    obtainedProof: text().notNull(),
    correctiveActionDecisions: text().notNull(),
    comments: text().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
