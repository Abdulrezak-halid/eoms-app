/**
 * @file: RouterUSysIssue.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.12.2024
 * Last Modified Date: 08.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaEIssueType } from "@m/core/schemas/SchemaEIssueType";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaStringLong } from "@m/core/schemas/SchemaStringLong";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { ServiceIssue } from "@m/core/services/ServiceIssue";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

export const RouterUSysIssue = UtilOpenApi.createRouter<IHonoContextUser>();

RouterUSysIssue.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.array(
        z.object({
          id: SchemaUuid,
          type: SchemaEIssueType,
          description: SchemaStringLong.nullable(),
          createdAt: SchemaDatetime,
          createdByUserDisplayName: SchemaString,
          orgDisplayName: SchemaString,
        }),
      ),
    ),
  }),
  async (c) => {
    const recs = await ServiceIssue.getAll(c.var);
    return c.json(recs);
  },
);

RouterUSysIssue.openapi(
  createRoute({
    method: "delete",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        id: SchemaUuid,
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceIssue.remove(c.var, json.id);
    return UtilHono.resNull(c);
  },
);
