import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { ServiceAccessToken } from "@m/base/services/ServiceAccessToken";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextAccessToken } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaEMetricResourceValuePeriod } from "../schemas/SchemaEMetricResourceValuePeriod";
import { SchemaEMetricType } from "../schemas/SchemaEMetricType";
import { SchemaEUnitGroup } from "../schemas/SchemaEUnitGroup";
import { SchemaTimedValueList } from "../schemas/SchemaTimedValueList";
import { ServiceInboundIntegration } from "../services/ServiceInboundIntegration";
import { ServiceMetric } from "../services/ServiceMetric";

export const RouterAMetric =
  UtilOpenApi.createRouter<IHonoContextAccessToken>();

// Route is same as RouterMetric.values
RouterAMetric.openapi(
  createRoute({
    path: "/values/{id}",
    method: "get",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
        count: z.coerce.number().min(1).max(100).optional().default(20),
        page: z.coerce.number().min(1).optional().default(1),
        period: SchemaEMetricResourceValuePeriod,
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            value: z.number(),
            datetime: SchemaDatetime,
            sampleCount: z.number(),
          }),
        ),
        recordCount: z.number(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    ServiceAccessToken.checkPermMetricResourceValueMetricId(c.var, param.id);
    const results = await ServiceMetric.getValues(c.var, "METRIC", param.id, {
      ...query,
      skipInterpolatedValues: true,
    });
    return c.json(results);
  },
);

RouterAMetric.openapi(
  createRoute({
    path: "/hooks/{id}",
    method: "post",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          values: SchemaTimedValueList,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    const integration = await ServiceInboundIntegration.get(c.var, param.id);

    if (integration.config.type !== "WEBHOOK") {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Integration type is not webhook.",
      );
    }

    const output = integration.outputs.find((d) => d.outputKey === "default");

    if (!output) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "Default output of webhook inbound integration is not found.",
      );
    }

    ServiceAccessToken.checkPermMetricResourceValueMetricId(
      c.var,
      output.metricId,
    );

    await ServiceInboundIntegration.setLastRun(c.var, param.id);

    await ServiceMetric.addValues(
      c.var,
      c.var.session.orgId,
      output.metricId,
      output.unit,
      json.values,
      [
        {
          type: "INTERNAL",
          key: "SOURCE",
          value: "INBOUND_INTEGRATION",
        },
        {
          type: "INTERNAL",
          key: "INBOUND_INTEGRATION_TYPE",
          value: "WEBHOOK",
        },
      ],
    );

    return UtilHono.resNull(c);
  },
);

RouterAMetric.openapi(
  createRoute({
    method: "get",
    path: "/names",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        search: z.string().optional(),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            type: SchemaEMetricType,
            unitGroup: SchemaEUnitGroup,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    if (!c.var.session.permissions.canListMetrics === false) {
      throw new ApiException(
        EApiFailCode.FORBIDDEN,
        "User does not have permission to list metric",
      );
    }
    const records = await ServiceMetric.getNames(c.var, {
      search: query.search,
    });
    return c.json({ records });
  },
);
