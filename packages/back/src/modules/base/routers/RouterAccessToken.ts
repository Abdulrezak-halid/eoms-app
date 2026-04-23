import { createRoute, z } from "@hono/zod-openapi";

import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEMetricType } from "@m/measurement/schemas/SchemaEMetricType";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";

import { guardOrganizationPlanFeature } from "../middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "../middlewares/guardPermission";
import { ServiceAccessToken } from "../services/ServiceAccessToken";

export const RouterAccessToken = UtilOpenApi.createRouter<IHonoContextUser>();

RouterAccessToken.use(guardOrganizationPlanFeature("ACCESS_TOKEN"));
RouterAccessToken.use(guardPermission("/BASE/ACCESS_TOKEN"));

RouterAccessToken.openapi(
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
            permissions: z.object({
              metricResourceValueMetrics: z.array(
                z.object({
                  id: SchemaUuid,
                  name: SchemaString,
                  type: SchemaEMetricType,
                }),
              ),
              canListMetrics: z.boolean(),
              canListMeters: z.boolean(),
              canListSeus: z.boolean(),
            }),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceAccessToken.getAll(c.var);
    return c.json({ records });
  },
);

RouterAccessToken.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: {
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          permissions: z.object({
            metricResourceValueMetricIds: UtilArray.zUniqueArray(SchemaUuid),
            canListMetrics: z.boolean(),
            canListMeters: z.boolean(),
            canListSeus: z.boolean(),
          }),
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
    await ServiceMetric.checkOrgOwnership(
      c.var,
      json.permissions.metricResourceValueMetricIds,
    );
    const result = await ServiceAccessToken.create(c.var, json);
    return c.json({ id: result.id, token: result.token });
  },
);

RouterAccessToken.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          permissions: z.object({
            metricResourceValueMetricIds: UtilArray.zUniqueArray(SchemaUuid),
            canListMetrics: z.boolean(),
            canListMeters: z.boolean(),
            canListSeus: z.boolean(),
          }),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceMetric.checkOrgOwnership(
      c.var,
      json.permissions.metricResourceValueMetricIds,
    );
    await ServiceAccessToken.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterAccessToken.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        token: z.string(), // It is a special string
        permissions: z.object({
          metricResourceValueMetrics: z.array(
            z.object({
              id: SchemaUuid,
              name: SchemaString,
              type: SchemaEMetricType,
            }),
          ),
          canListMetrics: z.boolean(),
          canListMeters: z.boolean(),
          canListSeus: z.boolean(),
        }),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceAccessToken.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterAccessToken.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceAccessToken.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
