import { createRoute, z } from "@hono/zod-openapi";

import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEAgentStatTypeNullable } from "@m/measurement/schemas/SchemaEAgentStatType";

import { ServiceAgent } from "../services/ServiceAgent";

export const RouterAgent = UtilOpenApi.createRouter<IHonoContextUser>();

RouterAgent.use(guardOrganizationPlanFeature("eoms_AGENT"));
RouterAgent.use(guardPermission("/AGENT"));

RouterAgent.openapi(
  createRoute({
    method: "get",
    path: "/assigned-items",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            serialNo: SchemaString,
            description: SchemaStringLong.nullable(),
            statType: SchemaEAgentStatTypeNullable,
            datetimeStat: SchemaDatetime.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceAgent.getAllByAssignedOrgId(c.var);
    return c.json({ records });
  },
);

UtilOpenApi.tag(RouterAgent, "Module: Agent");
