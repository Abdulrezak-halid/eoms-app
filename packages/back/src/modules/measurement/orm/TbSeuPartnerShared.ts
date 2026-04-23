import { index, pgTable, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbSeu } from "./TbSeu";

export const TbSeuPartnerShared = pgTable(
  "tb_measurement_seu_partner_shared",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    partnerId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
  },
  (t) => [index().on(t.orgId, t.subjectId)],
);
