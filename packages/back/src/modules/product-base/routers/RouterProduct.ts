import { createRoute, z } from "@hono/zod-openapi";

import { guardPermission } from "@m/base/middlewares/guardPermission";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEUnitGroup } from "@m/measurement/schemas/SchemaEUnitGroup";

import { ServiceProduct } from "../services/ServiceProduct";

export const RouterProduct = UtilOpenApi.createRouter<IHonoContextUser>();

RouterProduct.use(guardPermission("/PRODUCT"));

RouterProduct.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            code: SchemaString,
            description: SchemaStringLong.nullable(),
            unit: SchemaEUnitGroup,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceProduct.getAll(c.var);
    return c.json({ records });
  },
);

RouterProduct.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        code: SchemaString,
        description: SchemaStringLong.nullable(),
        unit: SchemaEUnitGroup,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceProduct.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterProduct.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        code: SchemaString,
        description: SchemaStringLong.nullable(),
        unit: SchemaEUnitGroup,
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
    const createdId = await ServiceProduct.create(c.var, json);
    return c.json({ id: createdId });
  },
);
RouterProduct.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          code: SchemaString,
          description: SchemaStringLong.nullable(),
          unit: SchemaEUnitGroup,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceProduct.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);
RouterProduct.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceProduct.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
