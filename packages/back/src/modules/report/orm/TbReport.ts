import {
  date,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { INamedRecord } from "@m/analysis/interfaces/INameList";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataMessageQueueTaskStatus } from "@m/core/interfaces/IMessageQueueTaskStatus";

import { IPlainOrTranslatableText } from "../interfaces/IPlainOrTranslatableText";
import { IReport } from "../interfaces/IReport";

export const TbReport = pgTable(
  "tb_report",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),

    title: jsonb().$type<IPlainOrTranslatableText>().notNull(),
    config: jsonb().$type<IReport>().notNull(),
    attachments: jsonb().$type<INamedRecord[]>().notNull(),

    dateStart: date({ mode: "string" }).notNull(),
    dateEnd: date({ mode: "string" }).notNull(),

    timezone: text().notNull(),

    status: text({ enum: DataMessageQueueTaskStatus }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
