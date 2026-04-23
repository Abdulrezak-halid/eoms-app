import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextCore } from "@m/core/interfaces/IContext";
import { SchemaEmail } from "@m/core/schemas/SchemaEmail";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { ServiceMail } from "@m/core/services/ServiceMail";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

export const RouterDevMail = UtilOpenApi.createRouter<IHonoContextCore>();

RouterDevMail.openapi(
  createRoute({
    method: "post",
    path: "/send",
    request: UtilOpenApi.genRequestJson(
      z.object({
        to: SchemaEmail,
        content: SchemaString,
        subject: SchemaString,
      }),
    ),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const json = c.req.valid("json");

    await ServiceMail.send(c.var, json);

    return UtilHono.resNull(c);
  },
);
