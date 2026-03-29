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
import { SchemaOutboundIntegrationConfig } from "../schemas/SchemaOutboundIntegrationConfig";
import { SchemaTimedValue } from "../schemas/SchemaTimedValueList";
import { ServiceMetric } from "../services/ServiceMetric";
import { ServiceOutboundIntegration } from "../services/ServiceOutboundIntegration";

export const RouterOutboundIntegration =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterOutboundIntegration.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            config: SchemaOutboundIntegrationConfig,
            outputs: z.array(
              z.object({
                outputKey: SchemaStringLong,
                isHealthy: z.boolean().nullable(),
                metricId: SchemaUuid,
                metricName: SchemaString,
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
    const records = await ServiceOutboundIntegration.getAll(c.var);
    return c.json({ records });
  },
);

RouterOutboundIntegration.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        config: SchemaOutboundIntegrationConfig,
        outputs: z.array(
          z.object({
            outputKey: SchemaStringLong,
            isHealthy: z.boolean().nullable(),
            metricId: SchemaUuid,
            metricName: SchemaString,
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
    const record = await ServiceOutboundIntegration.get(c.var, param.id);
    return c.json(record);
  },
);

RouterOutboundIntegration.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        config: SchemaOutboundIntegrationConfig,
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

    await ServiceMetric.checkOrgOwnership(
      c.var,
      json.outputs.map((d) => d.metricId),
    );

    const id = await ServiceOutboundIntegration.create(
      c.var,
      json.name,
      json.config,
      json.outputs,
    );

    return c.json({ id });
  },
);

RouterOutboundIntegration.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          config: SchemaOutboundIntegrationConfig,
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

    await ServiceMetric.checkOrgOwnership(
      c.var,
      json.outputs.map((d) => d.metricId),
    );

    await ServiceOutboundIntegration.update(
      c.var,
      param.id,
      json.name,
      json.config,
      json.outputs,
    );

    return UtilHono.resNull(c);
  },
);

RouterOutboundIntegration.openapi(
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

    await ServiceOutboundIntegration.enable(c.var, param.id, json.enabled);

    return UtilHono.resNull(c);
  },
);

RouterOutboundIntegration.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceOutboundIntegration.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);

RouterOutboundIntegration.openapi(
  createRoute({
    method: "post",
    path: "/run",
    request: UtilOpenApi.genRequestJson(
      z.object({
        config: SchemaOutboundIntegrationConfig,
        outputKeys: UtilArray.zUniqueArray(SchemaStringLong),
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        result: z.array(
          z.object({
            outputKey: z.string(),
            data: SchemaTimedValue.optional(),
            info: z.unknown().optional(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const result = await ServiceOutboundIntegration.run(
      c.var,
      json.config,
      json.outputKeys,
    );
    return c.json({ result });
  },
);
