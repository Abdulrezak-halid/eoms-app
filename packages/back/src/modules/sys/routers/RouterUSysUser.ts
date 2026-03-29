/**
 * @file: RouterUSysUser.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.12.2024
 * Last Modified Date: 26.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import { SchemaSessionDetail } from "@m/base/schemas/SchemaSessionDetail";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceSysUser } from "../services/ServiceSysUser";

export const RouterUSysUser = UtilOpenApi.createRouter<IHonoContextUser>();

RouterUSysUser.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            displayName: SchemaString,
            email: SchemaString,
            orgDisplayName: SchemaString,
            lastSessionAt: SchemaDatetime.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceSysUser.getAll(c.var);
    return c.json({ records });
  },
);

RouterUSysUser.openapi(
  createRoute({
    method: "post",
    path: "/impersonate",
    request: UtilOpenApi.genRequestJson(z.object({ id: SchemaUuid })),
    responses: UtilOpenApi.genResponseJson(SchemaSessionDetail),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const res = await ServiceSysUser.impersonateUser(c, json.id);
    return c.json(res);
  },
);
