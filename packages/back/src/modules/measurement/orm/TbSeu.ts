import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { DataEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbSeu = pgTable(
  "tb_measurement_seus",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    name: text().notNull(),
    energyResource: text({ enum: DataEnergyResource }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // orgId, name: ServiceSeu, ServiceDataView
    uniqueIndex().on(t.orgId, t.name),
    index().on(t.orgId, t.createdAt),
  ],
);
