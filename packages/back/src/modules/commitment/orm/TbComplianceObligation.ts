import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataPeriod } from "@m/commitment/interfaces/IPeriod";

export const TbComplianceObligation = pgTable(
  "tb_commitment_compliance_obligations",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    complianceObligation: text().notNull(),
    officialNewspaperNo: text().notNull(),
    officialNewspaperPublicationDate: date({ mode: "string" }).notNull(),
    reviewPeriod: text({ enum: DataPeriod }).notNull(),
    reviewDate: date({ mode: "string" }).notNull(),
    revisionNo: text().notNull(),
    revisionDate: date({ mode: "string" }).notNull(),
    isLegalActive: boolean().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
