/**
 * @file: OutboundIntegrationHandlerMockSource.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode, UtilDate } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { ServiceMockSource } from "@m/dev/services/ServiceMockSource";

import { IOutboundIntegrationHandler } from "../interfaces/IOutboundIntegrationHandler";
import { TbOutboundIntegrationParamMockSource } from "../orm/TbOutboundIntegrationParamMockSource";

export const OutboundIntegrationHandlerMockSource: IOutboundIntegrationHandler<{
  waves: { vMul: number; hMul: number }[];
}> = {
  async get(c, orgId, id) {
    const [record] = await c.db
      .select({
        waves: TbOutboundIntegrationParamMockSource.waves,
      })
      .from(TbOutboundIntegrationParamMockSource)
      .where(
        and(
          eq(TbOutboundIntegrationParamMockSource.orgId, orgId),
          eq(TbOutboundIntegrationParamMockSource.subjectId, id),
        ),
      );

    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Mock source integration param is not found.",
      );
    }

    return record;
  },

  async create(c, orgId, id, param) {
    await c.db.insert(TbOutboundIntegrationParamMockSource).values({
      orgId,
      subjectId: id,
      waves: param.waves,
    });
  },

  async remove(c, orgId, id) {
    await c.db
      .delete(TbOutboundIntegrationParamMockSource)
      .where(
        and(
          eq(TbOutboundIntegrationParamMockSource.orgId, orgId),
          eq(TbOutboundIntegrationParamMockSource.subjectId, id),
        ),
      );
  },

  run(c, _, p) {
    const datetime = UtilDate.getNowIsoDatetime();

    const result = ServiceMockSource.processWaves({
      waves: p.waves,
      datetime,
      datetimeTo: datetime,
    });

    const formattedResult = result.map((d) => ({
      outputKey: "default",
      data: {
        value: d.y,
        datetime: d.x,
      },
    }));

    c.logger.info("Metric integration mock source.");

    return formattedResult;
  },
};
