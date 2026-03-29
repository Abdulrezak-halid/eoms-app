import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringBoolean } from "@m/core/schemas/SchemaStringBoolean";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { IMetricResourceLabel } from "../interfaces/IMetricResourceLabel";
import { SchemaEInboundIntegrationType } from "../schemas/SchemaEInboundIntegrationType";
import { SchemaEMetricIntegrationPeriod } from "../schemas/SchemaEMetricIntegrationPeriod";
import { SchemaEMetricResourceValuePeriod } from "../schemas/SchemaEMetricResourceValuePeriod";
import { SchemaEMetricType } from "../schemas/SchemaEMetricType";
import { SchemaEOutboundIntegrationType } from "../schemas/SchemaEOutboundIntegrationType";
import { SchemaEUnit } from "../schemas/SchemaEUnit";
import { SchemaEUnitGroup } from "../schemas/SchemaEUnitGroup";
import { SchemaMetricResource } from "../schemas/SchemaMetricResource";
import { SchemaMetricResourceLabelWithoutType } from "../schemas/SchemaMetricResourceLabel";
import { SchemaTimedValue } from "../schemas/SchemaTimedValueList";
import { ServiceMetric } from "../services/ServiceMetric";
import { RouterMetricFileDraft } from "./RouterMetricFileDraft";

export const RouterMetric = UtilOpenApi.createRouter<IHonoContextUser>();

RouterMetric.route("/file-draft", RouterMetricFileDraft);

// Router is same as RouterAMetric.values

RouterMetric.openapi(
  createRoute({
    method: "post",
    path: "/item/{id}/values",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          unit: SchemaEUnit,
          values: SchemaTimedValue.array(),
          labels: UtilArray.zUniqueArray(SchemaMetricResourceLabelWithoutType, {
            key: "key",
          }),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        resourceId: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    const labels: IMetricResourceLabel[] = [
      ...json.labels.map((label) => ({
        ...label,
        type: "USER_DEFINED" as const,
      })),
      {
        type: "INTERNAL",
        key: "SOURCE",
        value: "API",
      },
    ];

    const resourceId = await ServiceMetric.addValues(
      c.var,
      c.var.session.orgId,
      param.id,
      json.unit,
      json.values,
      labels,
    );

    return c.json({ resourceId });
  },
);

RouterMetric.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}/graph",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
        lowResolutionMode: SchemaStringBoolean.optional(),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        period: SchemaEMetricResourceValuePeriod,
        values: z.array(
          z.object({
            value: z.number(),
            datetime: SchemaDate,
          }),
        ),
      }),
    ),
  }),

  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await ServiceMetric.getGraphValues(c.var, param.id, query);
    return c.json(result);
  },
);

RouterMetric.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}/graph-resources",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        period: SchemaEMetricResourceValuePeriod,
        values: z.array(
          z.object({
            resourceId: SchemaUuid,
            value: z.number(),
            datetime: SchemaDate,
          }),
        ),
      }),
    ),
  }),

  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await ServiceMetric.getGraphResourceValues(
      c.var,
      param.id,
      query,
    );
    return c.json(result);
  },
);

RouterMetric.openapi(
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
            type: SchemaEMetricType,
            unitGroup: SchemaEUnitGroup,
            lastValue: z.number().nullable(),
            lastValueDatetime: SchemaDatetime.nullable(),
            valuesUpdatedAt: SchemaDatetime.nullable(),
            outboundIntegration: z
              .object({
                id: SchemaUuid,
                period: SchemaEMetricIntegrationPeriod,
                type: SchemaEOutboundIntegrationType,
              })
              .nullable(),
            inboundIntegration: z
              .object({
                id: SchemaUuid,
                type: SchemaEInboundIntegrationType,
              })
              .nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceMetric.getAll(c.var);
    return c.json({ records });
  },
);

RouterMetric.openapi(
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
    const records = await ServiceMetric.getNames(c.var, {
      search: query.search,
    });
    return c.json({ records });
  },
);

RouterMetric.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        description: SchemaStringLong.nullable(),
        type: SchemaEMetricType,
        unitGroup: SchemaEUnitGroup,
        lastValue: z.number().nullable(),
        lastValueDatetime: SchemaDatetime.nullable(),
        valuesUpdatedAt: SchemaDatetime.nullable(),
        outboundIntegration: z
          .object({
            id: SchemaUuid,
            period: SchemaEMetricIntegrationPeriod,
            type: SchemaEOutboundIntegrationType,
          })
          .nullable(),
        inboundIntegration: z
          .object({
            id: SchemaUuid,
            type: SchemaEInboundIntegrationType,
          })
          .nullable(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceMetric.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterMetric.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        description: SchemaStringLong.nullable(),
        type: SchemaEMetricType,
        unitGroup: SchemaEUnitGroup,
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
    const createdId = await ServiceMetric.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterMetric.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
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
    await ServiceMetric.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterMetric.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({
      id: SchemaUuid,
    }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceMetric.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);

RouterMetric.openapi(
  createRoute({
    method: "delete",
    path: "/resource/{resourceId}/values",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        resourceId: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          datetimes: UtilArray.zUniqueArray(SchemaDatetime),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceMetric.checkOrgOwnershipResourceValue(
      c.var,
      param.resourceId,
      json.datetimes,
    );
    await ServiceMetric.deleteValues(c.var, param.resourceId, json.datetimes);
    return UtilHono.resNull(c);
  },
);

RouterMetric.openapi(
  createRoute({
    method: "get",
    path: "/resource/{resourceId}/values",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        resourceId: SchemaUuid,
      }),
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
        count: z.coerce.number().min(1).max(100).optional().default(20),
        page: z.coerce.number().min(1).optional().default(1),
        period: SchemaEMetricResourceValuePeriod.or(z.literal("RAW")),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            value: z.number(),
            datetime: SchemaDate,
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
    const result = await ServiceMetric.getValues(
      c.var,
      "RESOURCE",
      param.resourceId,
      {
        ...query,
        skipInterpolatedValues: true,
      },
    );
    return c.json(result);
  },
);

RouterMetric.openapi(
  createRoute({
    method: "get",
    path: "/resources",
    request: UtilOpenApi.genRequestQuery({
      metricId: SchemaUuid.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(SchemaMetricResource),
      }),
    ),
  }),

  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceMetric.getResources(c.var, {
      metricId: query.metricId,
    });
    return c.json({ records });
  },
);
