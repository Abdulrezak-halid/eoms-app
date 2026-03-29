import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbDataViewProfile } from "./TbDataViewProfile";
import { TbSeu } from "./TbSeu";

export const TbDataViewProfileSeu = pgTable(
  "tb_measurement_metric_view_profile_seus",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),

    subjectId: uuid()
      .notNull()
      .references(() => TbDataViewProfile.id),

    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.seuId)],
);
