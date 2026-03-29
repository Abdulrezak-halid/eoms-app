/**
 * @file: RouterUIssue.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.12.2024
 * Last Modified Date: 25.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";
import { MAX_ISSUE_DESC, MIN_ISSUE_DESC } from "common";

import type { IHonoContextUser } from "../interfaces/IContext";
import { SchemaEIssueType } from "../schemas/SchemaEIssueType";
import { ServiceIssue } from "../services/ServiceIssue";
import { UtilHono } from "../utils/UtilHono";
import { UtilOpenApi } from "../utils/UtilOpenApi";

export const RouterUIssue = UtilOpenApi.createRouter<IHonoContextUser>();

RouterUIssue.openapi(
  createRoute({
    method: "post",
    path: "/",
    request: UtilOpenApi.genRequestJson(
      z.object({
        type: SchemaEIssueType,
        description: z.string().min(MIN_ISSUE_DESC).max(MAX_ISSUE_DESC),
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");
    await ServiceIssue.create(c.var, json);
    return UtilHono.resNull(c);
  },
);
