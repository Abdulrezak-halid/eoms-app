import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEPeriod } from "@m/commitment/schemas/SchemaEPeriod";
import { ServiceEnergyPolicy } from "@m/commitment/services/ServiceEnergyPolicy";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceQdmsIntegration } from "@m/dms/services/ServiceQdmsIntegration";

export const RouterEnergyPolicy = UtilOpenApi.createRouter<IHonoContextUser>();

RouterEnergyPolicy.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            content: SchemaStringLong,
            type: SchemaString.nullable(),
            target: SchemaString.nullable(),
            period: SchemaEPeriod,
          }),
        ),
        qdmsIntegrationId: SchemaUuid.optional(),
      }),
    ),
  }),
  async (c) => {
    const qdmsIntegrationId = await ServiceQdmsIntegration.getIdByBindingPage(
      c.var,
      "ENERGY_POLICIES",
    );
    const records = await ServiceEnergyPolicy.getAll(
      c.var,
      c.var.session.orgId,
    );
    return c.json({ records, qdmsIntegrationId });
  },
);

RouterEnergyPolicy.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        content: SchemaStringLong,
        type: SchemaString.nullable(),
        target: SchemaString.nullable(),
        period: SchemaEPeriod,
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
    const createdId = await ServiceEnergyPolicy.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterEnergyPolicy.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        content: SchemaStringLong,
        type: SchemaString.nullable(),
        target: SchemaString.nullable(),
        period: SchemaEPeriod,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceEnergyPolicy.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterEnergyPolicy.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          content: SchemaStringLong,
          type: SchemaString.nullable(),
          target: SchemaString.nullable(),
          period: SchemaEPeriod,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceEnergyPolicy.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterEnergyPolicy.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceEnergyPolicy.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
