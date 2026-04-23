import { createRoute, z } from "@hono/zod-openapi";

import { IHonoContextCore } from "@m/core/interfaces/IContext";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { UtilTimezone } from "@m/core/utils/UtilTimezone";
import { ServiceReport } from "@m/report/services/ServiceReport";

import { UtilDevReport } from "../utils/UtilDevReport";

export const RouterDevReport = UtilOpenApi.createRouter<IHonoContextCore>();

RouterDevReport.openapi(
  createRoute({
    method: "get",
    path: "/create",
    request: {
      headers: z.object({
        "accept-language": z.string().optional(),
      }),
      query: UtilOpenApi.genRequestQuerySub({
        lang: z.string().optional(),
        tz: z.string().optional(),
      }),
    },
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaString,
      }),
    ),
  }),
  async (c) => {
    const header = c.req.valid("header");
    const query = c.req.valid("query");

    const timezone = query.tz || "Europe/Istanbul";
    const tzOffset = UtilTimezone.getTimezoneOffset(timezone);

    const mockReport = await UtilDevReport.generateReport(
      c.var,
      tzOffset,
      query.lang,
    );

    const id = await ServiceReport.create(
      mockReport.contextUser,
      mockReport.report,
      [],
      timezone,
      header["accept-language"],
    );

    return c.json({ id });
  },
);

RouterDevReport.openapi(
  createRoute({
    method: "get",
    path: "/render",
    request: {
      query: UtilOpenApi.genRequestQuerySub({
        lang: z.string().optional(),
        tz: z.string().optional(),
      }),
    },
    responses: UtilOpenApi.genResponseHtml(),
  }),
  async (c) => {
    const query = c.req.valid("query");

    const timezone = query.tz || "Europe/Istanbul";
    const tzOffset = UtilTimezone.getTimezoneOffset(timezone);

    const mockReport = await UtilDevReport.generateReport(
      c.var,
      tzOffset,
      query.lang,
    );

    const report = await ServiceReport.renderHtml(
      mockReport.contextReport,
      mockReport.report,
    );

    return UtilHono.resJsx(c, report);
  },
);
