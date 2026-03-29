/** @file: RouterUser.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.11.2024
 * Last Modified Date: 16.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { SchemaEPermission } from "@m/base/schemas/SchemaEPermission";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaEmail } from "@m/core/schemas/SchemaEmail";
import { SchemaPassword } from "@m/core/schemas/SchemaPassword";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { ServiceCookie } from "@m/core/services/ServiceCookie";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceUser } from "../../base/services/ServiceUser";
import { guardOrganizationPlanFeature } from "../middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "../middlewares/guardPermission";
import { ServiceSession } from "../services/ServiceSession";

export const RouterUser = UtilOpenApi.createRouter<IHonoContextUser>();

RouterUser.use(guardOrganizationPlanFeature("USER_MANAGEMENT"));
RouterUser.use(guardPermission("/BASE/USER"));

RouterUser.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            email: SchemaString,
            name: SchemaString,
            surname: SchemaString.nullable(),
            phone: SchemaString.nullable(),
            position: SchemaString.nullable(),
            createdAt: SchemaDatetime,
            lastSessionAt: SchemaDatetime.nullable(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceUser.getAll(c.var);
    return c.json({ records });
  },
);

RouterUser.openapi(
  createRoute({
    method: "get",
    path: "/display-names",
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
    const records = await ServiceUser.getDisplayNames(c.var);
    return c.json({ records });
  },
);

RouterUser.openapi(
  createRoute({
    method: "get",
    path: "/permissions/{userId}",
    request: UtilOpenApi.genRequestParam({ userId: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        displayName: SchemaString,
        permissions: z.array(SchemaEPermission),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const displayName = await ServiceUser.getDisplayName(c.var, param.userId);
    const permissions = await ServiceUser.getPermissions(c.var, param.userId);
    return c.json({ displayName, permissions });
  },
);

RouterUser.openapi(
  createRoute({
    method: "put",
    path: "/permission/{userId}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ userId: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          permission: SchemaEPermission,
          value: z.boolean(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");

    await ServiceUser.checkOrgOwnership(c.var, [param.userId]);

    // User cannot drop his /CORE/USER permission
    const isUserSelf = param.userId === c.var.session.userId;
    if (isUserSelf && json.permission === "/BASE/USER") {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "You cannot remove your own permisson.",
      );
    }

    await ServiceUser.setPermission(
      c.var,
      param.userId,
      json.permission,
      json.value,
    );

    if (isUserSelf) {
      // If user removes his / (All) permission, auto add /CORE/USER permission
      if (json.permission === "/") {
        // Ignore if setPermission throws ALREADY_EXISTS db error
        try {
          await ServiceUser.setPermission(
            c.var,
            param.userId,
            "/BASE/USER",
            true,
          );
        } catch (e) {
          void e;
        }
      }

      // Update session and drop other sessions
      const permissions = await ServiceUser.getPermissions(
        c.var,
        c.var.session.userId,
      );
      await ServiceSession.updatePermissions(
        c.var,
        c.var.session.token,
        permissions,
      );
    } else {
      // Drop user sessions
      await ServiceSession.removeByUserId(c.var, param.userId);
    }

    return UtilHono.resNull(c);
  },
);

RouterUser.openapi(
  createRoute({
    method: "post",
    path: "/item",
    request: UtilOpenApi.genRequestJson(
      z.object({
        email: SchemaEmail,
        name: SchemaString,
        surname: SchemaString.optional(),
        phone: SchemaString.optional(),
        position: SchemaString.optional(),
        password: SchemaPassword,
      }),
    ),
    responses: UtilOpenApi.genResponseJson(z.object({ id: SchemaUuid })),
  }),
  async (c) => {
    const json = c.req.valid("json");
    const id = await ServiceUser.create(c.var, json);
    return c.json({ id });
  },
);

RouterUser.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        email: SchemaString,
        name: SchemaString,
        surname: SchemaString.nullable(),
        phone: SchemaString.nullable(),
        position: SchemaString.nullable(),
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceUser.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterUser.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          email: SchemaEmail,
          name: SchemaString,
          surname: SchemaString.optional(),
          phone: SchemaString.optional(),
          position: SchemaString.optional(),
          password: SchemaPassword.optional(),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const json = c.req.valid("json");
    await ServiceUser.checkOrgOwnership(c.var, [param.id]);
    await ServiceUser.update(c.var, param.id, json);
    await ServiceSession.removeByUserId(c.var, param.id);
    // TODO why cookie clear?
    if (param.id === c.var.session.userId) {
      ServiceCookie.clear(c);
    }
    return UtilHono.resNull(c);
  },
);

RouterUser.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    if (param.id === c.var.session.userId) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "You cannot remove your own user.",
      );
    }
    await ServiceUser.checkOrgOwnership(c.var, [param.id]);
    await ServiceSession.removeByUserId(c.var, param.id);
    await ServiceUser.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);
