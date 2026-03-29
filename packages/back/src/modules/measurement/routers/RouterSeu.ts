import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ServiceDepartment } from "@m/base/services/ServiceDepartment";
import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaQueryUuidList } from "@m/core/schemas/SchemaQueryUuidList";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringBoolean } from "@m/core/schemas/SchemaStringBoolean";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { SchemaEMetricResourceValuePeriod } from "../schemas/SchemaEMetricResourceValuePeriod";
import { ServiceMeterSlice } from "../services/ServiceMeterSlice";

export const RouterSeu = UtilOpenApi.createRouter<IHonoContextUser>();

RouterSeu.openapi(
  createRoute({
    method: "get",
    path: "/item",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime,
      datetimeMax: SchemaDatetime,
      seuIds: SchemaQueryUuidList.optional(),
      primary: SchemaStringBoolean.optional(),
      energyResource: SchemaEEnergyResource.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            energyResource: SchemaEEnergyResource,
            consumption: z.number().nullable(),
            percentage: z.number().nullable(),
            departments: z.array(
              z.object({
                id: SchemaUuid,
                name: SchemaString,
              }),
            ),
            meterSlices: z.array(
              z.object({
                id: SchemaUuid,
                name: z.string(),
                rate: z.number(),
                departmentId: SchemaUuid,
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceSeu.getAll(c.var, query);
    return c.json({ records });
  },
);

RouterSeu.openapi(
  createRoute({
    method: "get",
    path: "/names",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            energyResource: SchemaEEnergyResource,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceSeu.getNames(c.var);
    return c.json({ records });
  },
);

RouterSeu.openapi(
  createRoute({
    method: "get",
    path: "/departments-in-use",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(SchemaUuid),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceSeu.getDepartmentsInUse(c.var);
    return c.json({ records });
  },
);

RouterSeu.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        energyResource: SchemaEEnergyResource,
        departmentIds: UtilArray.zUniqueArray(SchemaUuid),
        meterSliceIds: UtilArray.zUniqueArray(SchemaUuid),
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
    await ServiceDepartment.checkOrgOwnership(c.var, json.departmentIds);
    await ServiceMeterSlice.checkOrgOwnership(c.var, json.meterSliceIds);
    await ServiceOrganization.hasEnergyResource(c.var, [json.energyResource]);
    const createdId = await ServiceSeu.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterSeu.openapi(
  createRoute({
    method: "get",
    path: "/graph",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime,
      datetimeMax: SchemaDatetime,
      seuIds: SchemaQueryUuidList.optional(),
      primary: SchemaStringBoolean.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        period: SchemaEMetricResourceValuePeriod,
        series: z.array(
          z.object({
            seu: z.object({
              id: SchemaUuid,
              name: z.string(),
              energyResource: SchemaEEnergyResource,
            }),
            values: z.array(
              z.object({
                datetime: SchemaDate,
                value: z.number(),
              }),
            ),
          }),
        ),
      }),
    ),
  }),

  async (c) => {
    const query = c.req.valid("query");
    const result = await ServiceSeu.getGraphValues(c.var, query);
    return c.json(result);
  },
);

RouterSeu.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        energyResource: SchemaEEnergyResource,
        consumption: z.number().nullable(),
        percentage: z.number().nullable(),
        departments: z.array(z.object({ id: SchemaUuid, name: SchemaString })),
        meterSlices: z.array(
          z.object({
            id: SchemaUuid,
            name: z.string(),
            rate: z.number(),
            departmentId: SchemaUuid,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    const record = await ServiceSeu.get(c.var, param.id, query);

    return c.json(record);
  },
);

RouterSeu.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          energyResource: SchemaEEnergyResource,
          departmentIds: UtilArray.zUniqueArray(SchemaUuid),
          meterSliceIds: UtilArray.zUniqueArray(SchemaUuid),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceDepartment.checkOrgOwnership(c.var, json.departmentIds);
    await ServiceMeterSlice.checkOrgOwnership(c.var, json.meterSliceIds);
    await ServiceOrganization.hasEnergyResource(c.var, [json.energyResource]);
    await ServiceSeu.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterSeu.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceSeu.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);

RouterSeu.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}/values",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      query: UtilOpenApi.genRequestQuerySub({
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
        period: SchemaEMetricResourceValuePeriod,
        count: z.coerce.number().min(1).max(100).optional().default(20),
        page: z.coerce.number().min(1).optional().default(1),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            value: z.number(),
            datetime: SchemaString,
          }),
        ),
        recordCount: z.number(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await ServiceSeu.getValues(c.var, param.id, query);
    return c.json(result);
  },
);

RouterSeu.openapi(
  createRoute({
    method: "get",
    path: "/suggest",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        minConsumptionPercentage: z.coerce
          .number()
          .min(1)
          .max(100)
          .optional()
          .default(80),
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            name: SchemaString,
            energyResource: SchemaEEnergyResource,
            meterSlices: z
              .object({ id: SchemaUuid, name: SchemaString })
              .array(),
          }),
        ),
      }),
    ),
  }),

  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceSeu.findSuggestions(c.var, query);
    return c.json({ records });
  },
);
