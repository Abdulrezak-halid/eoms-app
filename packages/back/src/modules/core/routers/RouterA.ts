import { createRoute, z } from "@hono/zod-openapi";

import { APP_NAME } from "@/constants";

import { IHonoContextAccessToken } from "@m/core/interfaces/IContext";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { MiddlewareAccessTokenGuard } from "../../base/middlewares/MiddlewareAccessTokenGuard";

export const RouterA = UtilOpenApi.createRouter<IHonoContextAccessToken>();

RouterA.use(MiddlewareAccessTokenGuard);

RouterA.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({ name: z.string(), env: z.string() }),
    ),
  }),
  (c) => c.json({ name: APP_NAME, env: c.var.env.ENV_NAME }),
);

// Tag is set at RouterRoot
