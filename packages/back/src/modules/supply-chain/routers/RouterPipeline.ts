import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServicePipeline } from "../services/ServicePipeline";
import { RouterOperation } from "./RouterOperation";

export const RouterPipeline = UtilOpenApi.createRouter<IHonoContextUser>();

RouterPipeline.route("/operation", RouterOperation);

RouterPipeline.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            createdAt: SchemaDatetime,
            name: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServicePipeline.getAll(c.var);
    return c.json({ records });
  },
);

RouterPipeline.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        createdAt: SchemaDatetime,
        name: SchemaString,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServicePipeline.get(c.var, param.id);
    return c.json(record);
  },
);

RouterPipeline.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
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
    const res = await ServicePipeline.create(c.var, json.name);
    return c.json(res);
  },
);

RouterPipeline.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServicePipeline.update(c.var, param.id, json.name);
    return UtilHono.resNull(c);
  },
);

RouterPipeline.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServicePipeline.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
