/**
 * @file: RouterUSysRuntimePatcher.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.11.2024
 * Last Modified Date: 27.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

export const RouterRuntimePatcher =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterRuntimePatcher.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        patchesNew: z.array(SchemaString),
        patchesApplied: z.array(
          z.object({
            index: z.number(),
            name: SchemaString,
            appliedAt: SchemaDatetime,
            outdated: z.boolean(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const rec = await ServiceRuntimePatcher.getStatus(c.var);
    return c.json(rec);
  },
);

RouterRuntimePatcher.openapi(
  createRoute({
    method: "post",
    path: "/apply",
    request: UtilOpenApi.genRequestJson(z.object({ name: SchemaString })),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceRuntimePatcher.apply(c.var, json.name);
    return UtilHono.resNull(c);
  },
);

RouterRuntimePatcher.openapi(
  createRoute({
    method: "post",
    path: "/sync",
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    await ServiceRuntimePatcher.sync(c.var);
    return UtilHono.resNull(c);
  },
);

RouterRuntimePatcher.openapi(
  createRoute({
    method: "delete",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({ index: z.number().int().min(0) }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceRuntimePatcher.remove(c.var, json.index);
    return UtilHono.resNull(c);
  },
);
