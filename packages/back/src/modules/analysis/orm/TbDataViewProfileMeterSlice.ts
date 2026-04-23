import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbDataViewProfile } from "./TbDataViewProfile";
import { TbMeterSlice } from "../../measurement/orm/TbMeterSlice";

export const TbDataViewProfileMeterSlice = pgTable(
  "tb_measurement_metric_view_profile_meter_slices",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),

    subjectId: uuid()
      .notNull()
      .references(() => TbDataViewProfile.id),

    meterSliceId: uuid()
      .notNull()
      .references(() => TbMeterSlice.id),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.meterSliceId)],
);
