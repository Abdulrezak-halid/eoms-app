import { createRoute } from "@hono/zod-openapi";

import { MiddlewareUserSessionGuard } from "@m/base/middlewares/MiddlewareUserSessionGuard";
import { ServiceSession } from "@m/base/services/ServiceSession";

import type { IHonoContextUser } from "../interfaces/IContext";
import { ServiceCookie } from "../services/ServiceCookie";
import { UtilHono } from "../utils/UtilHono";
import { UtilOpenApi } from "../utils/UtilOpenApi";
import { RouterUIssue } from "./RouterUIssue";
import { RouterUProfile } from "./RouterUProfile";

export const RouterU = UtilOpenApi.createRouter<IHonoContextUser>();

RouterU.use(MiddlewareUserSessionGuard);

RouterU.openapi(
  createRoute({
    method: "get",
    path: "/logout",
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    ServiceCookie.clear(c);
    await ServiceSession.remove(c.var, c.var.session.token);
    return UtilHono.resNull(c);
  },
);

RouterU.route("/profile", RouterUProfile);
RouterU.route("/issue", RouterUIssue);

UtilOpenApi.tag(RouterU, "User");
