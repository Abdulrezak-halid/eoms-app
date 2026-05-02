import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEMetricIntegrationPeriod } from "@m/measurement/schemas/SchemaEMetricIntegrationPeriod";
import { SchemaEUnitGroup } from "@m/measurement/schemas/SchemaEUnitGroup";

import { ServiceReportSectionData } from "../services/ServiceReportSectionData";

export const RouterReportSectionData =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterReportSectionData.openapi(
  createRoute({
    method: "get",
    path: "/consumption-cost-monthly",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime,
      datetimeMax: SchemaDatetime,
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            datetime: SchemaDatetime,
            energyResources: z.partialRecord(
              SchemaEEnergyResource,
              z.object({
                consumption: z.number(),
                cost: z.number(),
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");

    const records =
      await ServiceReportSectionData.getConsumptionCostValuesMonthly(
        c.var,
        query.datetimeMin,
        query.datetimeMax,
      );

    return c.json({ records });
  },
);

RouterReportSectionData.openapi(
  createRoute({
    method: "get",
    path: "/primary-regression-driver-list",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime,
      datetimeMax: SchemaDatetime,
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            unitGroup: SchemaEUnitGroup,
            integrationPeriod: SchemaEMetricIntegrationPeriod.nullable(),
            departmentNames: z.array(z.string()),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");

    const records =
      await ServiceReportSectionData.getPrimaryRegressionDriverList(
        c.var,
        query.datetimeMin,
        query.datetimeMax,
      );

    return c.json({ records });
  },
);

RouterReportSectionData.openapi(
  createRoute({
    method: "get",
    path: "/energy-consumption",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime,
      datetimeMax: SchemaDatetime,
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.partialRecord(
          SchemaEEnergyResource,
          z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              rate: z.number(),
              isMain: z.boolean(),
              energyResource: SchemaEEnergyResource,
              meterId: z.string(),
              metric: z.object({
                id: z.string(),
                name: z.string(),
                unitGroup: SchemaEUnitGroup,
              }),
              department: z.object({
                id: z.string(),
                name: z.string(),
              }),
              consumption: z.number().nullable(),
            }),
          ),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");

    const records =
      await ServiceReportSectionData.getMetersGroupedByEnergyResource(
        c.var,
        query.datetimeMin,
        query.datetimeMax,
      );

    return c.json({ records });
  },
);
