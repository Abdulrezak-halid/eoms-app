import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataTrainingCategory } from "../interfaces/ITrainingCategory";

export const TbTraining = pgTable(
  "tb_trainings",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    title: text().notNull(),
    date: date({ mode: "string" }).notNull(),
    category: text({ enum: DataTrainingCategory }).notNull(),
    trainerUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
