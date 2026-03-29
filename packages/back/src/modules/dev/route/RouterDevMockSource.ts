import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextCore } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";

import { ServiceMockSource } from "../services/ServiceMockSource";

export const RouterDevMockSource = UtilOpenApi.createRouter<IHonoContextCore>();

RouterDevMockSource.openapi(
  createRoute({
    method: "post",
    path: "/",
    request: UtilOpenApi.genRequestJson(
      z.object({
        waves: z.array(
          z.object({
            vMul: z.number().openapi({ example: 10 }),
            hMul: z.number().openapi({ example: 10 }),
          }),
        ),
        datetime: SchemaDatetime.optional(),
        datetimeTo: SchemaDatetime.optional(),
      }),
    ),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        values: z.array(
          z.object({
            x: SchemaDate,
            y: z.number(),
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const json = await c.req.json();
    const values = ServiceMockSource.processWaves({
      waves: json.waves,
      datetime: json.date || c.var.nowDate,
      datetimeTo: json.dateTo || json.date || c.var.nowDate,
    });
    return c.json({ values });
  },
);
