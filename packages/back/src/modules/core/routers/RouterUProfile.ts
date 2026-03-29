/**
 * @file: RouterUProfile.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 16.11.2024
 * Last Modified Date: 16.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import { ServiceSession } from "../../base/services/ServiceSession";
import { ServiceUser } from "../../base/services/ServiceUser";
import { IHonoContextUser } from "../interfaces/IContext";
import { SchemaPassword } from "../schemas/SchemaPassword";
import { ServiceCookie } from "../services/ServiceCookie";
import { UtilHono } from "../utils/UtilHono";
import { UtilOpenApi } from "../utils/UtilOpenApi";

export const RouterUProfile = UtilOpenApi.createRouter<IHonoContextUser>();

RouterUProfile.openapi(
  createRoute({
    method: "post",
    path: "/password",
    request: UtilOpenApi.genRequestJson(z.object({ password: SchemaPassword })),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceUser.updatePassword(c.var, json.password);
    await ServiceSession.removeByUserId(c.var, c.var.session.userId);
    ServiceCookie.clear(c);
    return UtilHono.resNull(c);
  },
);
