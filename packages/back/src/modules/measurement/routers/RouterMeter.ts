import { createRoute, z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { ServiceOrganizationPartner } from "@m/base/services/ServiceOrganizationPartner";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaEUnitGroup } from "../schemas/SchemaEUnitGroup";
import { ServiceMeter } from "../services/ServiceMeter";
import { RouterMeterSlice } from "./RouterMeterSlice";

export const RouterMeter = UtilOpenApi.createRouter<IHonoContextUser>();

RouterMeter.route("/slice", RouterMeterSlice);

RouterMeter.openapi(
  createRoute({
    method: "get",
    path: "/item",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime,
      datetimeMax: SchemaDatetime,
      energyResource: SchemaEEnergyResource.optional(),
      partnerId: SchemaUuid.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            org: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            name: SchemaString,
            energyResource: SchemaEEnergyResource,
            energyConversionRate: z.number(),
            consumption: z.number().nullable(),
            consumptionPercentage: z.number().nullable(),
            metric: z.object({
              id: SchemaUuid,
              name: SchemaString,
              unitGroup: SchemaEUnitGroup,
            }),
            slices: z.array(
              z.object({
                id: SchemaUuid,
                rate: z.number(),
                department: z.object({
                  id: SchemaUuid,
                  name: SchemaString,
                }),
                isMain: z.boolean(),
              }),
            ),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceMeter.getAll(c.var, query);
    return c.json({ records });
  },
);

RouterMeter.openapi(
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
    const records = await ServiceMeter.getNames(c.var);
    return c.json({ records });
  },
);

RouterMeter.openapi(
  createRoute({
    method: "get",
    path: "/shared-meters",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceMeter.getSharedMeters(c.var);
    return c.json({ records });
  },
);

RouterMeter.openapi(
  createRoute({
    method: "get",
    path: "/shared-partners/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            displayName: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const records = await ServiceMeter.getSharedPartners(c.var, param.id);
    return c.json({ records });
  },
);

RouterMeter.openapi(
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
        energyConversionRate: z.number(),
        consumption: z.number().nullable(),
        consumptionPercentage: z.number().nullable(),
        metric: z.object({
          id: SchemaUuid,
          name: SchemaString,
          unitGroup: SchemaEUnitGroup,
        }),
        slices: z.array(
          z.object({
            id: SchemaUuid,
            rate: z.number(),
            department: z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
            isMain: z.boolean(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const query = c.req.valid("query");
    const rec = await ServiceMeter.get(c.var, param.id, query);
    return c.json(rec);
  },
);

RouterMeter.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        energyResource: SchemaEEnergyResource,
        metricId: SchemaUuid,
        departmentId: SchemaUuid,
        energyConversionRate: z.number(),
        isMain: z.boolean(),
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        sliceId: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceMeter.checkMetricEnergyResourceCompatibility(
      c.var,
      json.metricId,
      json.energyResource,
    );
    await ServiceOrganization.hasEnergyResource(c.var, [json.energyResource]);

    const meter = await ServiceMeter.create(c.var, json);
    return c.json({ id: meter.id, sliceId: meter.sliceId });
  },
);

RouterMeter.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          energyResource: SchemaEEnergyResource,
          energyConversionRate: z.number(),
          metricId: SchemaUuid,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceMeter.checkMetricEnergyResourceCompatibility(
      c.var,
      json.metricId,
      json.energyResource,
    );
    await ServiceMeter.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterMeter.openapi(
  createRoute({
    method: "put",
    path: "/share/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({
        id: SchemaUuid,
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          partnerIds: SchemaUuid.array(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceOrganizationPartner.checkOrgPartnerShip(
      c.var,
      json.partnerIds,
    );
    await ServiceMeter.shareWithPartners(c.var, param.id, json.partnerIds);
    return UtilHono.resNull(c);
  },
);

RouterMeter.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceMeter.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);

RouterMeter.openapi(
  createRoute({
    method: "delete",
    path: "/shared/{id}",
    request: UtilOpenApi.genRequestParam({
      id: SchemaUuid,
    }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceMeter.removeSharedMeter(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
