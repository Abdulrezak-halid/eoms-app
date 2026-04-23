/**
 * @file: RouterRoot.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2024
 * Last Modified Date: 10.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { otel } from "@hono/otel";
import { createRoute, z } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import { APP_NAME } from "@/constants";

import type { IHonoContextCore } from "../interfaces/IContext";
import { ErrorHandler } from "../middlewares/ErrorHandler";
import { MiddlewareDevDelay } from "../middlewares/MiddlewareDevDelay";
import { MiddlewareLog } from "../middlewares/MiddlewareLog";
import { MiddlewareRootVars } from "../middlewares/MiddlewareRootVars";
import { UtilOpenApi } from "../utils/UtilOpenApi";

export const RouterRoot = UtilOpenApi.createRouter<IHonoContextCore>();

RouterRoot.use(cors());

if (process.env.NODE_ENV === "development") {
  RouterRoot.use(MiddlewareDevDelay);
}

// TODO if export url is not set, do not register middleware or skip somehow?
RouterRoot.use(otel());

RouterRoot.use(MiddlewareRootVars);
RouterRoot.use(MiddlewareLog);

RouterRoot.onError(ErrorHandler);

RouterRoot.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        name: z.string(),
        env: z.string(),
        buildId: z.string().optional(),
      }),
    ),
    tags: ["Other"],
  }),
  (c) =>
    c.json({
      name: APP_NAME,
      env: c.var.env.ENV_NAME,
      buildId: c.var.env.BUILD_ID,
    }),
);
