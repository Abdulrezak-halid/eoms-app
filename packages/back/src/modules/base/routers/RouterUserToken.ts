import { createRoute, z } from "@hono/zod-openapi";

import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { guardOrganizationPlanFeature } from "../middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "../middlewares/guardPermission";
import { ServiceUserToken } from "../services/ServiceUserToken";

export const RouterUserToken = UtilOpenApi.createRouter<IHonoContextUser>();

RouterUserToken.use(guardOrganizationPlanFeature("USER_TOKEN"));
RouterUserToken.use(guardPermission("/BASE/USER_TOKEN"));

RouterUserToken.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            token: z.string(), // It is a special string
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceUserToken.getAll(c.var);
    return c.json({ records });
  },
);

RouterUserToken.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: {
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        token: z.string(), // It is a special string
      }),
    ),
  }),
  async (c) => {
    const json = c.req.valid("json");

    const result = await ServiceUserToken.create(c.var, json);
    return c.json({ id: result.id, token: result.token });
  },
);

RouterUserToken.openapi(
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

    await ServiceUserToken.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterUserToken.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        token: z.string(), // It is a special string
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceUserToken.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterUserToken.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceUserToken.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
