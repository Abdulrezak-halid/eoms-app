/**
 * @file: RouterUSysOrganization.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.11.2024
 * Last Modified Date: 08.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { SchemaOrganizationPlan } from "@m/base/schemas/SchemaOrganizationPlan";
import { ServiceSession } from "@m/base/services/ServiceSession";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaEmail } from "@m/core/schemas/SchemaEmail";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { SchemaWorkspace } from "@m/core/schemas/SchemaWorkspace";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceOrganization } from "../../base/services/ServiceOrganization";
import { RouterUSysOrganizationBanner } from "./RouterUSysOrganizationBanner";

export const RouterUSysOrganization =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterUSysOrganization.route("/", RouterUSysOrganizationBanner);

RouterUSysOrganization.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            displayName: SchemaString,
            fullName: SchemaString,
            address: SchemaString,
            phones: z.array(SchemaString),
            email: SchemaString,
            config: z.object({
              energyResources: z.array(SchemaEEnergyResource),
            }),
            workspace: SchemaString,
            plan: SchemaOrganizationPlan,
            hasBanner: z.boolean(),
            createdAt: SchemaDatetime,
            userCount: z.number().nullable(),
            lastSessionAt: SchemaDate.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceOrganization.getAll(c.var);
    return c.json({ records });
  },
);

RouterUSysOrganization.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        displayName: SchemaString,
        fullName: SchemaString,
        address: SchemaString,
        phones: z.array(SchemaString),
        email: SchemaString,
        config: z.object({ energyResources: z.array(SchemaEEnergyResource) }),
        workspace: SchemaString,
        plan: SchemaOrganizationPlan,
        hasBanner: z.boolean(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceOrganization.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterUSysOrganization.openapi(
  createRoute({
    method: "get",
    path: "/names",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            displayName: SchemaString,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceOrganization.getNames(c.var);
    return c.json({ records });
  },
);

RouterUSysOrganization.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        displayName: SchemaString,
        fullName: SchemaString,
        address: SchemaString,
        phones: z.array(SchemaString),
        email: SchemaString,
        config: z.object({ energyResources: z.array(SchemaEEnergyResource) }),
        workspace: SchemaWorkspace,
        adminEmail: SchemaEmail,
        adminName: SchemaString,
        plan: SchemaOrganizationPlan,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
      }),
    ),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const createdId = await ServiceOrganization.create(c.var, json);
    return c.json({ id: createdId });
  },
);

RouterUSysOrganization.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          displayName: SchemaString,
          fullName: SchemaString,
          address: SchemaString,
          phones: z.array(SchemaString),
          email: SchemaString,
          config: z.object({ energyResources: z.array(SchemaEEnergyResource) }),
          workspace: SchemaWorkspace,
          plan: SchemaOrganizationPlan,
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceOrganization.update(c.var, param.id, json);
    await ServiceSession.removeAllByOrgId(c.var, param.id);
    return UtilHono.resNull(c);
  },
);

RouterUSysOrganization.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    if (param.id === c.var.session.orgId) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "You cannot delete your own organization while logged in.",
      );
    }
    await ServiceOrganization.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
