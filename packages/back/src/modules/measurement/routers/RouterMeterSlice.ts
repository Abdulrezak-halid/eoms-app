import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ServiceDepartment } from "@m/base/services/ServiceDepartment";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringBoolean } from "@m/core/schemas/SchemaStringBoolean";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceMeterSlice } from "../services/ServiceMeterSlice";

export const RouterMeterSlice = UtilOpenApi.createRouter<IHonoContextUser>();

RouterMeterSlice.openapi(
  createRoute({
    method: "post",
    path: "/{meterId}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ meterId: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z
          .array(
            z.object({
              id: SchemaUuid.optional(),
              rate: z.number().gt(0).max(1),
              departmentId: SchemaUuid,
              isMain: z.boolean(),
            }),
          )
          .refine(
            (items) => {
              if (items.length === 0) {
                return true;
              }
              const total = items.reduce((sum, item) => sum + item.rate, 0);
              return Math.abs(total - 1) <= 1e-6;
            },
            { message: "Total rate must be 1." },
          ),
      ),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        createdIds: z.array(SchemaUuid),
        updatedIds: z.array(SchemaUuid),
        deletedIds: z.array(SchemaUuid),
      }),
    ),
  }),
  async (c) => {
    const { meterId } = c.req.valid("param");
    const json = c.req.valid("json");

    const departmentIds = json.map((item) => item.departmentId);
    await ServiceDepartment.checkOrgOwnership(c.var, departmentIds);

    const result = await ServiceMeterSlice.save(c.var, meterId, json);
    return c.json(result);
  },
);

RouterMeterSlice.openapi(
  createRoute({
    method: "get",
    path: "/",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        energyResource: SchemaEEnergyResource.optional(),
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
        mainOnly: SchemaStringBoolean.optional(),
        nonMainOnly: SchemaStringBoolean.optional(),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            rate: z.number(),
            consumption: z.number().nullable(),
            consumptionPercentage: z.number().nullable().optional(),
            isMain: z.boolean(),
            energyResource: SchemaEEnergyResource,
            meterId: SchemaUuid,
            metric: z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
            department: z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceMeterSlice.getAll(c.var, query);
    return c.json({ records });
  },
);

RouterMeterSlice.openapi(
  createRoute({
    method: "get",
    path: "/main-consumptions",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        energyResource: SchemaEEnergyResource.optional(),
        datetimeMin: SchemaDatetime,
        datetimeMax: SchemaDatetime,
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            energyResource: SchemaEEnergyResource,
            consumption: z.number(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceMeterSlice.getMainConsumptionList(
      c.var,
      query,
    );
    return c.json({ records });
  },
);

RouterMeterSlice.openapi(
  createRoute({
    method: "get",
    path: "/names",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        energyResource: SchemaEEnergyResource.optional(),
        mainOnly: SchemaStringBoolean.optional(),
        nonMainOnly: SchemaStringBoolean.optional(),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            rate: z.number(),
            energyResource: SchemaEEnergyResource,
            metricId: SchemaUuid,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceMeterSlice.getNames(c.var, query);
    return c.json({ records });
  },
);
