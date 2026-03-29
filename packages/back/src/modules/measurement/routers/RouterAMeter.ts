import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextAccessToken } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaNameWithEnergyResource } from "../schemas/SchemaNameWithEnergyResource";
import { ServiceMeter } from "../services/ServiceMeter";

export const RouterAMeter = UtilOpenApi.createRouter<IHonoContextAccessToken>();

// Route is same as some RouterMeter routes.

RouterAMeter.openapi(
  createRoute({
    method: "get",
    path: "/names",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(SchemaNameWithEnergyResource),
      }),
    ),
  }),
  async (c) => {
    if (!c.var.session.permissions.canListMeters) {
      throw new ApiException(
        EApiFailCode.FORBIDDEN,
        "User does not have permission to list meters",
      );
    }
    const records = await ServiceMeter.getNames(c.var);
    return c.json({ records });
  },
);
