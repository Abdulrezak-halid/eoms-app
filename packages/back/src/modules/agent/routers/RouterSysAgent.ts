import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaAgentStat } from "@m/measurement/schemas/SchemaAgentStat";
import { SchemaEAgentStatTypeNullable } from "@m/measurement/schemas/SchemaEAgentStatType";

import { ServiceAgent } from "../services/ServiceAgent";

export const RouterSysAgent = UtilOpenApi.createRouter<IHonoContextUser>();

RouterSysAgent.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            serialNo: SchemaString,
            description: SchemaStringLong.nullable(),
            assignedOrg: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            statType: SchemaEAgentStatTypeNullable,
            datetimeStat: SchemaDatetime.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceAgent.getAll(c.var);
    return c.json({ records });
  },
);

RouterSysAgent.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        serialNo: SchemaString,
        description: SchemaStringLong.nullable(),
        assignedOrg: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceAgent.get(c.var, param.id);
    return c.json(record);
  },
);

RouterSysAgent.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}/stats",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        serialNo: SchemaString,
        description: SchemaStringLong.nullable(),
        stats: SchemaAgentStat.nullable(),
        statType: SchemaEAgentStatTypeNullable,
        datetimeStat: SchemaDatetime.nullable(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceAgent.getStats(c.var, param.id);
    return c.json(record);
  },
);

RouterSysAgent.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        serialNo: SchemaString,
        description: SchemaStringLong.nullable(),
        assignedOrgId: SchemaUuid,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceAgent.checkAssignedOrgOwnership(c.var, [json.assignedOrgId]);
    const createdId = await ServiceAgent.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterSysAgent.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          serialNo: SchemaString,
          description: SchemaStringLong.nullable(),
          assignedOrgId: SchemaUuid,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceAgent.checkAssignedOrgOwnership(c.var, [json.assignedOrgId]);
    await ServiceAgent.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterSysAgent.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceAgent.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
