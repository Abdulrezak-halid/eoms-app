/**
 * @file: TbOutboundIntegrationParamMockSource.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { index, jsonb, pgTable, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbOutboundIntegration } from "./TbOutboundIntegration";

export const TbOutboundIntegrationParamMockSource = pgTable(
  "tb_measurement_integration_params_mock_source",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbOutboundIntegration.id),

    waves: jsonb().$type<{ vMul: number; hMul: number }[]>().notNull(),
  },
  (t) => [index().on(t.orgId, t.subjectId)],
);
