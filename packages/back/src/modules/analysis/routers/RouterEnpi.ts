import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { ServiceEnpi } from "@m/analysis/services/ServiceEnpi";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

export const RouterEnpi = UtilOpenApi.createRouter<IHonoContextUser>();

RouterEnpi.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            seu: z.object({ id: SchemaUuid, name: SchemaString }),
            equipment: SchemaString,
            targetedDate: SchemaDate,
            targetedImprovement: z.number(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceEnpi.getAll(c.var);
    return c.json({ records });
  },
);

RouterEnpi.openapi(
  createRoute({
    method: "get",
    path: "/names",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            displayName: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceEnpi.getNames(c.var);
    return c.json({ records });
  },
);

RouterEnpi.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        seuId: SchemaUuid,
        equipment: SchemaString,
        targetedDate: SchemaDate,
        targetedImprovement: z.number().min(0).max(MAX_API_NUMBER_VALUE),
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
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    const id = await ServiceEnpi.create(c.var, json);
    return c.json({ id });
  },
);

RouterEnpi.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        seu: z.object({ id: SchemaUuid, name: SchemaString }),
        equipment: SchemaString,
        targetedDate: SchemaDate,
        targetedImprovement: z.number(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceEnpi.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterEnpi.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          seuId: SchemaUuid,
          equipment: SchemaString,
          targetedDate: SchemaDate,
          targetedImprovement: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    await ServiceEnpi.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterEnpi.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceEnpi.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
