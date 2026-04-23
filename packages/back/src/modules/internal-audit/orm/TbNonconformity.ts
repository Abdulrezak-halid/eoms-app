import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbNonconformity = pgTable(
  "tb_internal_audit_nonconformities",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    definition: text().notNull(),
    no: integer().notNull(),
    identifiedAt: date({ mode: "string" }).notNull(),
    requirement: text().notNull(),
    source: text().notNull(),
    potentialResult: text().notNull(),
    rootCause: text().notNull(),
    action: text().notNull(),
    responsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    targetIdentificationDate: date({ mode: "string" }).notNull(),
    actualIdentificationDate: date({ mode: "string" }).notNull(),
    isCorrectiveActionOpen: boolean().notNull(),
    reviewerUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    reviewerFeedback: text().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
