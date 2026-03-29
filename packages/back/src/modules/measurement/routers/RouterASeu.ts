import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextAccessToken } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaNameWithEnergyResource } from "../schemas/SchemaNameWithEnergyResource";
import { ServiceSeu } from "../services/ServiceSeu";

export const RouterASeu = UtilOpenApi.createRouter<IHonoContextAccessToken>();

// Route is same as some RouterSeu routes.

RouterASeu.openapi(
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
    if (!c.var.session.permissions.canListSeus) {
      throw new ApiException(
        EApiFailCode.FORBIDDEN,
        "User does not have permission to list seus",
      );
    }
    const records = await ServiceSeu.getNames(c.var);
    return c.json({ records });
  },
);
