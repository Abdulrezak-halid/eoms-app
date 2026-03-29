import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceOperation } from "../services/ServiceOperation";
import { ServicePipeline } from "../services/ServicePipeline";

export const RouterOperation = UtilOpenApi.createRouter<IHonoContextUser>();

RouterOperation.openapi(
  createRoute({
    method: "get",
    path: "/item",
    request: UtilOpenApi.genRequestQuery({ pipelineId: SchemaUuid.optional() }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            createdAt: SchemaDatetime,
            name: SchemaString,
            index: z.number(),
            pipeline: z.object({ id: SchemaUuid, name: SchemaString }),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceOperation.getAll(c.var, query.pipelineId);
    return c.json({ records });
  },
);

RouterOperation.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        createdAt: SchemaDatetime,
        name: SchemaString,
        pipeline: z.object({ id: SchemaUuid, name: SchemaString }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceOperation.get(c.var, param.id);
    return c.json(record);
  },
);

RouterOperation.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        pipelineId: SchemaUuid,
        index: z.number(),
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
    await ServicePipeline.checkOrgOwnership(c.var, [json.pipelineId]);
    const res = await ServiceOperation.create(c.var, json);
    return c.json(res);
  },
);

RouterOperation.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          pipelineId: SchemaUuid,
          index: z.number(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServicePipeline.checkOrgOwnership(c.var, [json.pipelineId]);
    await ServiceOperation.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterOperation.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceOperation.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
