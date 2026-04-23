/**
 * @file: RouterGOrganizationBanner.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.08.2025
 * Last Modified Date: 07.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { UtilWorkspace } from "@m/core/utils/UtilWorkspace";

import { ServiceOrganizationBanner } from "../services/ServiceOrganizationBanner";

export const RouterGOrganizationBanner =
  UtilOpenApi.createRouter<IHonoContextUser>();

RouterGOrganizationBanner.openapi(
  createRoute({
    method: "get",
    path: "/",
    request: {
      headers: z.object({ referer: z.string().optional() }),
    },
    responses: UtilOpenApi.genResponseFile(),
  }),
  async (c) => {
    const { referer } = c.req.valid("header");

    const id = referer
      ? await UtilWorkspace.getOrgIdFromUrl(c.var, referer)
      : null;
    if (!id) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Organization is not found using referer.",
      );
    }

    const content = await ServiceOrganizationBanner.getFile(c.var, id);

    return UtilHono.resFile(c, content, {
      contentType: "image/webp",
    });
  },
);
