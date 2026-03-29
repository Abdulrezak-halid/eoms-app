import { index, pgTable, real, text, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { DataWeatherQueryType } from "../interfaces/IWeatherQueryType";
import { TbOutboundIntegration } from "./TbOutboundIntegration";

export const TbOutboundIntegrationParamOpenWeather = pgTable(
  "tb_measurement_outbound_integration_params_open_weather",
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
