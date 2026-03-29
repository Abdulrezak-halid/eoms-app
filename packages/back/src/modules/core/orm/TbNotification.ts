import {
  boolean,
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { INotificationContent } from "../interfaces/INotificationContent";

export const TbNotification = pgTable(
  "tb_notifications",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    userId: uuid()
      .notNull()
      .references(() => TbUser.id),
    content: jsonb().notNull().$type<INotificationContent>(),
    read: boolean().notNull().default(false),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },

  (t) => [index().on(t.orgId, t.userId, t.createdAt)],
);
