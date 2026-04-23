import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode, UtilDate } from "common";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextAccessToken } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaMeterSlice } from "../schemas/SchemaMeterSlice";
import { ServiceMeterSlice } from "../services/ServiceMeterSlice";

export const RouterAMeterSlice =
  UtilOpenApi.createRouter<IHonoContextAccessToken>();

// Route is same as some RouterMeterSlice routes.

RouterAMeterSlice.openapi(
  createRoute({
    method: "get",
    path: "/names",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        energyResource: SchemaEEnergyResource.optional(),
        datetimeMin: SchemaDatetime.optional(),
        datetimeMax: SchemaDatetime.optional(),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(SchemaMeterSlice),
      }),
    ),
  }),
  async (c) => {
    const query = c.req.valid("query");
    if (!c.var.session.permissions.canListMeters) {
      throw new ApiException(
        EApiFailCode.FORBIDDEN,
        "User does not have permission to list meter slices",
      );
    }
    const oldestDate = new Date();
    oldestDate.setTime(0);
    const records = await ServiceMeterSlice.getAll(c.var, {
      energyResource: query.energyResource,
      datetimeMin: query.datetimeMin || UtilDate.objToIsoDatetime(oldestDate),
      datetimeMax: query.datetimeMax || UtilDate.objToIsoDatetime(new Date()),
    });
    return c.json({ records });
  },
);
