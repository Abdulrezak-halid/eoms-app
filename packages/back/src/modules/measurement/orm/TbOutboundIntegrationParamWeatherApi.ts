import { index, pgTable, real, text, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { DataWeatherQueryType } from "../interfaces/IWeatherQueryType";
import { TbOutboundIntegration } from "./TbOutboundIntegration";

export const TbOutboundIntegrationParamWeatherApi = pgTable(
  "tb_measurement_outbound_integration_params_weather_api",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbOutboundIntegration.id),

    queryType: text({ enum: DataWeatherQueryType }).notNull().default("CITY"),
    query: text().notNull(),
    baseTemp: real().notNull(),
  },
  (t) => [index().on(t.orgId, t.subjectId)],
);
