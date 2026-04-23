import { createRoute, z } from "@hono/zod-openapi";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { SchemaEPeriod } from "@m/commitment/schemas/SchemaEPeriod";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";
import { ServiceMaintenanceActivity } from "@m/support/services/ServiceMaintenanceActivity";

export const RouterMaintenanceActivity =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterMaintenanceActivity.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            seu: z.object({ id: SchemaUuid, name: SchemaString }),
            task: SchemaString,
            period: SchemaEPeriod,
            lastMaintainedAt: SchemaDate,
            responsibleUser: z.object({ id: SchemaUuid, name: SchemaString }),
            note: SchemaStringLong.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const rec = await ServiceMaintenanceActivity.getAll(c.var);
    return c.json(rec);
  },
);

RouterMaintenanceActivity.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        seu: z.object({ id: SchemaUuid, name: SchemaString }),
        task: SchemaString,
        period: SchemaEPeriod,
        lastMaintainedAt: SchemaDate,
        responsibleUser: z.object({ id: SchemaUuid, name: SchemaString }),
        note: SchemaStringLong.nullable(),
      }),
    ),
  }),
  async (c) => {
    const rec = await ServiceMaintenanceActivity.get(c.var, c.req.param("id"));
    return c.json(rec);
  },
);

RouterMaintenanceActivity.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        seuId: SchemaUuid,
        task: SchemaString,
        period: SchemaEPeriod,
        lastMaintainedAt: SchemaDate,
        responsibleUserId: SchemaUuid,
        note: SchemaStringLong.nullable(),
      }),
    ),
    responses: UtilOpenApi.genResponseJson(z.object({ id: SchemaUuid })),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    const createdId = await ServiceMaintenanceActivity.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterMaintenanceActivity.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          seuId: SchemaUuid,
          task: SchemaString,
          period: SchemaEPeriod,
          lastMaintainedAt: SchemaDate,
          responsibleUserId: SchemaUuid,
          note: SchemaStringLong.nullable(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceMaintenanceActivity.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterMaintenanceActivity.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceMaintenanceActivity.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
