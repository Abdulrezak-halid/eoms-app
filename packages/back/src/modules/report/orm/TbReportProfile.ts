import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { IPlainOrTranslatableText } from "../interfaces/IPlainOrTranslatableText";
import { IReport } from "../interfaces/IReport";

export const TbReportProfile = pgTable(
  "tb_report_profile",
  {
    id: uuid().primaryKey().defaultRandom(),
    // If orgId is null, that means it is a common template
    orgId: uuid().references(() => TbOrganization.id), //nullable
    createdBy: uuid().references(() => TbUser.id), //nullable
    createdAt: timestamp({ mode: "string" }).notNull(),
    commonLabel: jsonb().$type<IPlainOrTranslatableText>(),
    title: jsonb().$type<IPlainOrTranslatableText>().notNull(),
    content: jsonb().$type<IReport>().notNull(),
    description: jsonb().$type<IPlainOrTranslatableText>(), // nullable
  },
  (t) => [index().on(t.orgId, t.title)],
);
