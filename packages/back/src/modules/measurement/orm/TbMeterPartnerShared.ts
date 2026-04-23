import { index, pgTable, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbMeter } from "./TbMeter";

export const TbMeterPartnerShared = pgTable(
  "tb_measurement_meter_partner_shared",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbMeter.id),
    partnerId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
  },
  (t) => [index().on(t.orgId, t.subjectId)],
);
