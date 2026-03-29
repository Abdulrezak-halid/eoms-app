/**
 * @file: TbOutboundIntegrationParamAvevaPi.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.08.2025
 * Last Modified Date: 31.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbOutboundIntegration } from "./TbOutboundIntegration";

export const TbOutboundIntegrationParamAvevaPi = pgTable(
  "tb_measurement_outbound_integration_params_avevapi",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbOutboundIntegration.id),

    baseUrl: text().notNull(),
    username: text().notNull(),
    password: text().notNull(),
  },
  (t) => [index().on(t.orgId, t.subjectId)],
);
