/**
 * @file: TbInboundIntegrationParamAgent.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.08.2025
 * Last Modified Date: 01.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbAgent } from "@m/agent/orm/TbAgent";
import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbInboundIntegration } from "./TbInboundIntegration";

export const TbInboundIntegrationParamAgent = pgTable(
  "tb_measurement_inbound_integration_params_agent",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbInboundIntegration.id),
    agentId: uuid()
      .notNull()
      .references(() => TbAgent.id),
  },
  (t) => [
    // agentId: MqConsumerInboundIntegrationAgent
    uniqueIndex().on(t.agentId),

    // orgId, subjectId: ServiceInboundIntegration
    index().on(t.orgId, t.subjectId),
  ],
);
