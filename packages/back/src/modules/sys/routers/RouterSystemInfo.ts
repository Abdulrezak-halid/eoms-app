/**
 * @file: RouterSystemInfo.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2025
 * Last Modified Date: 06.11.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { SchemaESystemServiceStatus } from "../schemas/SchemaESystemServiceStatus";
import { ServiceSystemInfo } from "../services/ServiceSystemInfo";

export const RouterSystemInfo = UtilOpenApi.createRouter<IHonoContextUser>();

RouterSystemInfo.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        services: z.object({
          messageQueue: SchemaESystemServiceStatus,
        }),
      }),
    ),
  }),
  (c) => {
    const result = ServiceSystemInfo.get();
    return c.json(result);
  },
);
