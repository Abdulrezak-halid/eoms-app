/**
 * @file: RouterUSysOrganizationBanner.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.08.2025
 * Last Modified Date: 07.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { zFile } from "@m/core/schemas/SchemaFile";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceOrganizationBanner } from "../../base/services/ServiceOrganizationBanner";

export const RouterUSysOrganizationBanner =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterUSysOrganizationBanner.openapi(
  createRoute({
    method: "put",
    path: "/item/{id}/banner",
    request: {
      params: UtilOpenApi.genRequestParamSub({ id: SchemaUuid }),
      body: UtilOpenApi.genRequestFormSub(
        z.object({
          banner: zFile(
            [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/svg+xml",
              "image/gif",
              "image/avif",
              "image/heic",
              "image/heif",
            ],
            2048,
          ),
        }),
      ),
    },
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const form = c.req.valid("form");
    const id = c.req.param("id");

    await ServiceOrganizationBanner.checkAssignedOrgOwnership(c.var, id);
    await ServiceOrganizationBanner.save(
      c.var,
      id,
      Buffer.from(await form.banner.arrayBuffer()),
    );

    return UtilHono.resNull(c);
  },
);

RouterUSysOrganizationBanner.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}/banner",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const id = c.req.param("id");

    await ServiceOrganizationBanner.checkAssignedOrgOwnership(c.var, id);
    await ServiceOrganizationBanner.remove(c.var, id);

    return UtilHono.resNull(c);
  },
);

RouterUSysOrganizationBanner.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}/banner",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseFile(),
  }),
  async (c) => {
    const id = c.req.param("id");

    await ServiceOrganizationBanner.checkAssignedOrgOwnership(c.var, id);
    const content = await ServiceOrganizationBanner.getFile(c.var, id);

    return UtilHono.resFile(c, content, {
      contentType: "image/webp",
    });
  },
);
