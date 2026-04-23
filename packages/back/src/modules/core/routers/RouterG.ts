/**
 * @file: RouterG.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2024
 * Last Modified Date: 10.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";
import { EXAMPLE_USER_EMAIL, EXAMPLE_USER_PASSWORD } from "common";

import { SchemaSessionDetail } from "@m/base/schemas/SchemaSessionDetail";
import { ServiceSession } from "@m/base/services/ServiceSession";

import type { IHonoContextCore } from "../interfaces/IContext";
import { SchemaEmail } from "../schemas/SchemaEmail";
import { SchemaPassword } from "../schemas/SchemaPassword";
import { ServiceCaptcha } from "../services/ServiceCaptcha";
import { ServiceCookie } from "../services/ServiceCookie";
import { UtilOpenApi } from "../utils/UtilOpenApi";
import { UtilWorkspace } from "../utils/UtilWorkspace";

export const RouterG = UtilOpenApi.createRouter<IHonoContextCore>();

RouterG.openapi(
  createRoute({
    method: "post",
    path: "/login",
    request: {
      headers: z.object({
        referer: z.string().optional(),
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          email: SchemaEmail.openapi({
            example: EXAMPLE_USER_EMAIL,
            // Default is for postman
            default: EXAMPLE_USER_EMAIL,
          }),
          password: SchemaPassword.openapi({
            example: EXAMPLE_USER_PASSWORD,
            // Default is for postman
            default: EXAMPLE_USER_PASSWORD,
          }),
          token: z.string().min(1).max(4000).openapi({
            example: "DUMMY",
            // Default is for postman
            default: "DUMMY",
          }),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseJson(SchemaSessionDetail),
  }),
  async (c) => {
    const header = c.req.valid("header");
    const json = c.req.valid("json");

    await ServiceCaptcha.verifyToken(c, json.token);

    const workspace = header.referer
      ? UtilWorkspace.getWorkspaceFromUrl(c.var, header.referer)
      : null;

    const { userId, token } = await ServiceSession.login(c, {
      email: json.email,
      password: json.password,
      workspace,
    });

    await ServiceCookie.set(c, token);

    const sessionDetail = await ServiceSession.getUserData(c.var, userId);

    return c.json(sessionDetail);
  },
);

RouterG.openapi(
  createRoute({
    method: "get",
    path: "/session",
    request: {
      headers: z.object({ referer: z.string().optional() }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        publicOrganizationInfo: z
          .object({
            displayName: z.string(),
            hasBanner: z.boolean(),
          })
          .nullable(),
        session: SchemaSessionDetail.nullable(),
        buildId: z.string().optional(),
      }),
    ),
  }),
  async (c) => {
    const { referer } = c.req.valid("header");

    const publicOrganizationInfo = referer
      ? await UtilWorkspace.getPublicOrgInfoFromUrl(c.var, referer)
      : null;

    const session = await ServiceSession.find(c);

    return c.json({
      publicOrganizationInfo,
      session,
      buildId: c.var.env.BUILD_ID,
    });
  },
);
