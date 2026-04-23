import { createRoute, z } from "@hono/zod-openapi";
import { MAX_API_NUMBER_VALUE } from "common";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { ServiceUser } from "@m/base/services/ServiceUser";
import { SchemaEPeriod } from "@m/commitment/schemas/SchemaEPeriod";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { SchemaEUnit } from "@m/measurement/schemas/SchemaEUnit";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { ServiceCriticalOperationalParameter } from "../services/ServiceCriticalOperationalParameter";

export const RouterCriticalOperationalParameter =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterCriticalOperationalParameter.openapi(
  createRoute({
    method: "get",
    path: "/item",
    request: UtilOpenApi.genRequestQuery({
      datetimeMin: SchemaDatetime.optional(),
      datetimeMax: SchemaDatetime.optional(),
    }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            seu: z.object({
              id: SchemaUuid,
              name: SchemaString,
            }),
            energyResource: SchemaEEnergyResource,
            parameter: SchemaString,
            period: SchemaEPeriod,
            unit: SchemaEUnit,
            normalSettingValue: z.number(),
            lowerLimit: z.number(),
            upperLimit: z.number(),
            accuracyCalibrationFrequency: z.number(),
            measurementTool: SchemaString,
            valueResponsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            deviationResponsibleUser: z.object({
              id: SchemaUuid,
              displayName: SchemaString,
            }),
            note: SchemaStringLong.nullable(),
            controlDate: SchemaDate,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    const records = await ServiceCriticalOperationalParameter.getAll(
      c.var,
      c.var.session.orgId,
      query,
    );
    return c.json({ records });
  },
);

RouterCriticalOperationalParameter.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        seu: z.object({
          id: SchemaUuid,
          name: SchemaString,
        }),
        energyResource: SchemaEEnergyResource,
        parameter: SchemaString,
        period: SchemaEPeriod,
        unit: SchemaEUnit,
        normalSettingValue: z.number(),
        lowerLimit: z.number(),
        upperLimit: z.number(),
        accuracyCalibrationFrequency: z.number(),
        measurementTool: SchemaString,
        valueResponsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        deviationResponsibleUser: z.object({
          id: SchemaUuid,
          displayName: SchemaString,
        }),
        note: SchemaStringLong.nullable(),
        controlDate: SchemaDate,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceCriticalOperationalParameter.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterCriticalOperationalParameter.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        seuId: SchemaUuid,
        energyResource: SchemaEEnergyResource,
        parameter: SchemaString,
        period: SchemaEPeriod,
        unit: SchemaEUnit,
        normalSettingValue: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        lowerLimit: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        upperLimit: z.number().min(0).max(MAX_API_NUMBER_VALUE),
        accuracyCalibrationFrequency: z
          .number()
          .min(0)
          .max(MAX_API_NUMBER_VALUE),
        measurementTool: SchemaString,
        valueResponsibleUserId: SchemaUuid,
        deviationResponsibleUserId: SchemaUuid,
        note: SchemaStringLong.nullable(),
        controlDate: SchemaDate,
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
    await ServiceUser.checkOrgOwnership(c.var, [
      json.valueResponsibleUserId,
      json.deviationResponsibleUserId,
    ]);
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);

    await ServiceOrganization.hasEnergyResource(c.var, [json.energyResource]);
    const createdId = await ServiceCriticalOperationalParameter.create(
      c.var,
      json,
    );
    return c.json({ id: createdId });
  },
);

RouterCriticalOperationalParameter.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          seuId: SchemaUuid,
          energyResource: SchemaEEnergyResource,
          parameter: SchemaString,
          period: SchemaEPeriod,
          unit: SchemaEUnit,
          normalSettingValue: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          lowerLimit: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          upperLimit: z.number().min(0).max(MAX_API_NUMBER_VALUE),
          accuracyCalibrationFrequency: z
            .number()
            .min(0)
            .max(MAX_API_NUMBER_VALUE),
          measurementTool: SchemaString,
          valueResponsibleUserId: SchemaUuid,
          deviationResponsibleUserId: SchemaUuid,
          note: SchemaStringLong.nullable(),
          controlDate: SchemaDate,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const param = c.req.valid("param");

    await ServiceUser.checkOrgOwnership(c.var, [
      json.valueResponsibleUserId,
      json.deviationResponsibleUserId,
    ]);
    await ServiceSeu.checkOrgOwnership(c.var, [json.seuId]);
    await ServiceOrganization.hasEnergyResource(c.var, [json.energyResource]);
    await ServiceCriticalOperationalParameter.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterCriticalOperationalParameter.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceCriticalOperationalParameter.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
