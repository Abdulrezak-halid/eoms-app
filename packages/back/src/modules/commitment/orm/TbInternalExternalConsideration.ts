import {
  AnyPgColumn,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbInternalExternalConsideration = pgTable(
  "tb_commitment_internal_external_considerations",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    specific: text().notNull(),
    impactPoint: text().notNull(),
    evaluationMethod: text().notNull(),
    revisionDate: date({ mode: "string" }).notNull(),
    parentId: uuid().references(
      (): AnyPgColumn => TbInternalExternalConsideration.id,
    ),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.parentId, t.createdAt)],
);
