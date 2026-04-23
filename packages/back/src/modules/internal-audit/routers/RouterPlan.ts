import { createRoute, z } from "@hono/zod-openapi";

import { ServiceUser } from "@m/base/services/ServiceUser";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { ServicePlan } from "../services/ServicePlan";

export const RouterPlan = UtilOpenApi.createRouter<IHonoContextUser>();

RouterPlan.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            seu: z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
            responsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            scheduleDate: SchemaDate,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServicePlan.getAll(c.var);
    return c.json({ records });
  },
);
RouterPlan.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        seu: z.object({
          id: SchemaUuid,
          name: SchemaString,
        }),
        responsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        scheduleDate: SchemaDate,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServicePlan.get(c.var, param.id);
    return c.json(record);
  },
);
RouterPlan.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        seuId: SchemaUuid,
        name: SchemaString,
        responsibleUserId: SchemaUuid,
        scheduleDate: SchemaDate,
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
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    const createdId = await ServicePlan.create(c.var, json);
    return c.json({ id: createdId });
  },
);
RouterPlan.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          seuId: SchemaUuid,
          name: SchemaString,
          responsibleUserId: SchemaUuid,
          scheduleDate: SchemaDate,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, [json.responsibleUserId]);
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    await ServicePlan.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);
RouterPlan.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServicePlan.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
