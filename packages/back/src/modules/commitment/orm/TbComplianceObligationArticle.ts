import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataPeriod } from "@m/commitment/interfaces/IPeriod";

import { TbComplianceObligation } from "./TbComplianceObligation";

export const TbComplianceObligationArticle = pgTable(
  "tb_commitment_compliance_obligation_articles",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    subjectId: uuid()
      .notNull()
      .references(() => TbComplianceObligation.id),
    relatedArticleNo: text().notNull(),
    currentApplication: text().notNull(),
    conformityAssessment: text().notNull(),
    conformityAssessmentPeriod: text({ enum: DataPeriod }).notNull(),
    lastConformityAssessment: text().notNull(),
    description: text(), // nullable
  },
  (t) => [index().on(t.orgId, t.subjectId, t.createdAt)],
);
