/**
 * @file: RouterUSysMaintenance.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 08.12.2024
 * Last Modified Date: 08.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { ServiceMaintenance } from "@m/core/services/ServiceMaintenance";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

export const RouterUSysMaintenance =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterUSysMaintenance.openapi(
  createRoute({
    method: "post",
    path: "/",
    request: UtilOpenApi.genRequestJson(
      z.object({
        value: z.boolean(),
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceMaintenance.set(c.var, json.value);
    return UtilHono.resNull(c);
  },
);

RouterUSysMaintenance.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        value: z.boolean(),
      }),
    ),
  }),
  async (c) => {
    const value = await ServiceMaintenance.get(c.var);
    return c.json({ value });
  },
);
