/**
 * @file: RouterInboundIntegration.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.07.2025
 * Last Modified Date: 10.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaEUnit } from "../schemas/SchemaEUnit";
import {
  SchemaInboundIntegrationConfig,
  SchemaInboundIntegrationConfigGetter,
} from "../schemas/SchemaInboundIntegrationConfig";
import { ServiceInboundIntegration } from "../services/ServiceInboundIntegration";
import { ServiceMetric } from "../services/ServiceMetric";

export const RouterInboundIntegration =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterInboundIntegration.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            config: SchemaInboundIntegrationConfigGetter,
            outputs: z.array(
              z.object({
                outputKey: SchemaStringLong,
                metricId: SchemaUuid,
                metricName: z.string(),
                unit: SchemaEUnit,
              }),
            ),
            enabled: z.boolean(),
            lastRunAt: SchemaDatetime.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceInboundIntegration.getAll(c.var);
    return c.json({ records });
  },
);

RouterInboundIntegration.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        config: SchemaInboundIntegrationConfigGetter,
        outputs: z.array(
          z.object({
            outputKey: SchemaStringLong,
            metricId: SchemaUuid,
            metricName: z.string(),
            unit: SchemaEUnit,
          }),
        ),
        enabled: z.boolean(),
        lastRunAt: SchemaDatetime.nullable(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceInboundIntegration.get(c.var, param.id);
    return c.json(record);
  },
);

RouterInboundIntegration.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        config: SchemaInboundIntegrationConfig,
        outputs: UtilArray.zUniqueArray(
          z.object({
            outputKey: SchemaStringLong,
            metricId: SchemaUuid,
            unit: SchemaEUnit,
          }),
          { key: "outputKey" },
        ),
      }),
    ),
    responses: UtilOpenApi.genResponseJson(z.object({ id: SchemaUuid })),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceMetric.checkUnits(
      c.var,
      json.outputs.map((d) => ({
        id: d.metricId,
        unit: d.unit,
      })),
    );

    const id = await ServiceInboundIntegration.create(
      c.var,
      json.name,
      json.config,
      json.outputs,
    );

    return c.json({ id });
  },
);

RouterInboundIntegration.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          config: SchemaInboundIntegrationConfig,
          outputs: UtilArray.zUniqueArray(
            z.object({
              outputKey: SchemaStringLong,
              metricId: SchemaUuid,
              unit: SchemaEUnit,
            }),
            { key: "outputKey" },
          ),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    await ServiceMetric.checkUnits(
      c.var,
      json.outputs.map((d) => ({
        id: d.metricId,
        unit: d.unit,
      })),
    );

    await ServiceInboundIntegration.update(
      c.var,
      param.id,
      json.name,
      json.config,
      json.outputs,
    );

    return UtilHono.resNull(c);
  },
);

RouterInboundIntegration.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}/enable",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          enabled: z.boolean(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    await ServiceInboundIntegration.enable(c.var, param.id, json.enabled);

    return UtilHono.resNull(c);
  },
);

RouterInboundIntegration.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceInboundIntegration.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
