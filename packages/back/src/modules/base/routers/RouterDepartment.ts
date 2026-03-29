import { createRoute, z } from "@hono/zod-openapi";

import { guardPermission } from "@m/base/middlewares/guardPermission";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceDepartment } from "../services/ServiceDepartment";

export const RouterDepartment = UtilOpenApi.createRouter<IHonoContextUser>();

RouterDepartment.use(guardPermission("/BASE/DEPARTMENT"));

RouterDepartment.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            description: SchemaStringLong.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceDepartment.getAll(c.var);
    return c.json({ records });
  },
);

RouterDepartment.openapi(
  createRoute({
    method: "get",
    path: "/names",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceDepartment.getNames(c.var);
    return c.json({ records });
  },
);

RouterDepartment.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        description: SchemaStringLong.nullable(),
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
    const createdId = await ServiceDepartment.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterDepartment.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        description: SchemaStringLong.nullable(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceDepartment.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterDepartment.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          description: SchemaStringLong.nullable(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceDepartment.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterDepartment.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceDepartment.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
