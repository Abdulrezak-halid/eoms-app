import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbSeu } from "@m/measurement/orm/TbSeu";

import { TbEnergySavingOpportunity } from "./TbEnergySavingOpportunity";

export const TbEnergySavingOpportunitySeu = pgTable(
  "tb_planning_energy_saving_opportunity_seus",
  {
    subjectId: uuid()
      .notNull()
      .references(() => TbEnergySavingOpportunity.id),
    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id),
  },
  (t) => [uniqueIndex().on(t.subjectId, t.seuId)],
);
