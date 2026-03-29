import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import {
  SchemaDataViewTypeOptions,
  SchemaDataViewTypeOptionsWithDetails,
} from "../schemas/SchemaDataViewTypeOptions";
import { ServiceDataViewProfile } from "../services/ServiceDataViewProfile";
import { ServiceMeterSlice } from "../services/ServiceMeterSlice";
import { ServiceMetric } from "../services/ServiceMetric";
import { ServiceSeu } from "../services/ServiceSeu";

export const RouterDataViewProfile =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterDataViewProfile.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            name: SchemaString,
            description: SchemaStringLong.nullable(),
            options: SchemaDataViewTypeOptionsWithDetails,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceDataViewProfile.getAll(c.var);
    return c.json({ records });
  },
);

RouterDataViewProfile.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        name: SchemaString,
        description: SchemaStringLong.nullable(),
        options: SchemaDataViewTypeOptionsWithDetails,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const record = await ServiceDataViewProfile.get(c.var, param.id);
    return c.json(record);
  },
);

RouterDataViewProfile.openapi(
  createRoute({
    method: "post",
    path: "/",
    request: UtilOpenApi.genRequestJson(
      z.object({
        name: SchemaString,
        description: SchemaStringLong.nullable(),
        options: SchemaDataViewTypeOptions,
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

    switch (json.options.type) {
      case "METRIC":
        await ServiceMetric.checkOrgOwnership(c.var, json.options.metricIds);
        break;
      case "METER_SLICE":
        await ServiceMeterSlice.checkOrgOwnership(
          c.var,
          json.options.meterSliceIds,
        );
        await ServiceMeterSlice.validateEnergyResource(
          c.var,
          json.options.meterSliceIds,
          json.options.energyResource,
        );
        break;
      case "SEU":
        await ServiceSeu.checkOrgOwnership(c.var, json.options.seuIds);
        await ServiceSeu.validateEnergyResource(
          c.var,
          json.options.seuIds,
          json.options.energyResource,
        );
        break;

      default:
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Invalid metric view profile type in options.",
        );
    }

    const createdId = await ServiceDataViewProfile.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterDataViewProfile.openapi(
  createRoute({
    method: "put",
    path: "/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          name: SchemaString,
          description: SchemaStringLong.nullable(),
          options: SchemaDataViewTypeOptions,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    switch (json.options.type) {
      case "METRIC":
        await ServiceMetric.checkOrgOwnership(c.var, json.options.metricIds);
        break;
      case "METER_SLICE":
        await ServiceMeterSlice.checkOrgOwnership(
          c.var,
          json.options.meterSliceIds,
        );
        break;
      case "SEU":
        await ServiceSeu.validateEnergyResource(
          c.var,
          json.options.seuIds,
          json.options.energyResource,
        );
        await ServiceSeu.checkOrgOwnership(c.var, json.options.seuIds);
        break;

      default:
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Invalid metric view profile type in options.",
        );
    }

    await ServiceDataViewProfile.update(c.var, param.id, json);
    return UtilHono.resNull(c);
  },
);

RouterDataViewProfile.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceDataViewProfile.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
