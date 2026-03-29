import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataCalendarEntryType } from "../interfaces/ICalendarEntryType";

export const TbCalendarEntry = pgTable(
  "tb_calendar_entries",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    name: text().notNull(),
    description: text(), // nullable
    datetime: timestamp({ mode: "string" }).notNull(),
    datetimeEnd: timestamp({ mode: "string" }), // nullable
    type: text({ enum: DataCalendarEntryType }).notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name), index().on(t.orgId, t.datetime)],
);
