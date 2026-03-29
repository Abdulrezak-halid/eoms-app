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

export const TbCalibrationPlan = pgTable(
  "tb_support_calibration_plans",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    deviceType: text().notNull(),
    deviceNo: text().notNull(),
    brand: text().notNull(),
    location: text().notNull(),
    calibration: text().notNull(),
    calibrationNo: text().notNull(),
    responsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    dueTo: date({ mode: "string" }).notNull(),
    nextDate: date({ mode: "string" }).notNull(),
    evaluationResult: text().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
