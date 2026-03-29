import { createRoute, z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";

import { guardOrganizationPlanFeature } from "@m/base/middlewares/guardOrganizationPlanFeature";
import { guardPermission } from "@m/base/middlewares/guardPermission";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IHonoContextUser } from "@m/core/interfaces/IContext";
import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaMessageQueueTaskStatus } from "@m/core/schemas/SchemaMessageQueueTaskStatus";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";
import { UtilHono } from "@m/core/utils/UtilHono";
import { UtilLanguage } from "@m/core/utils/UtilLanguage";
import { UtilOpenApi } from "@m/core/utils/UtilOpenApi";
import { UtilTimezone } from "@m/core/utils/UtilTimezone";

import { SchemaReport } from "../schemas/SchemaReport";
import { SchemaPlainOrTranslatableText } from "../schemas/SchemaTranslatableKeys";
import { ServiceReport } from "../services/ServiceReport";
import { ServiceReportAttachment } from "../services/ServiceReportAttachment";
import { UtilReport } from "../utils/UtilReport";
import { RouterReportAttachment } from "./RouterReportAttachment";
import { RouterReportProfile } from "./RouterReportProfile";
import { RouterReportSectionData } from "./RouterReportSectionData";

export const RouterReport = UtilOpenApi.createRouter<IHonoContextUser>();

RouterReport.use(guardOrganizationPlanFeature("REPORT"));
RouterReport.use(guardPermission("/REPORT"));

RouterReport.route("/profile", RouterReportProfile);
RouterReport.route("/section-data", RouterReportSectionData);
RouterReport.route("/attachment", RouterReportAttachment);

RouterReport.openapi(
  createRoute({
    method: "post",
    path: "/render",
    request: {
      headers: z.object({
        "accept-language": z.string().optional(),
      }),
      query: z.object({
        tz: z.string(),
      }),
      body: UtilOpenApi.genRequestJsonSub(SchemaReport),
    },
    responses: UtilOpenApi.genResponseHtml(),
  }),
  async (c) => {
    const header = c.req.valid("header");
    const query = c.req.valid("query");
    const json = c.req.valid("json");

    const tzOffset = UtilTimezone.getTimezoneOffset(query.tz);

    if (!json.dateStart || !json.dateEnd) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Datetime range is missing.",
      );
    }

    const contextReport = {
      ...c.var,
      orgId: c.var.orgId,
      i18n: await UtilLanguage.create(c.var, header["accept-language"]),
      tzOffset,
      config: UtilReport.convertDateRangeToDatetimeRange(
        json.dateStart,
        json.dateEnd,
      ),
    };

    const report = await ServiceReport.renderHtml(contextReport, json, {
      withoutCss: true,
    });

    return UtilHono.resJsx(c, report);
  },
);

RouterReport.openapi(
  createRoute({
    method: "get",
    path: "/item",
    responses: UtilOpenApi.genResponseJson(
      z.object({
        records: z.array(
          z.object({
            id: SchemaUuid,
            title: SchemaPlainOrTranslatableText,
            status: SchemaMessageQueueTaskStatus,
            attachments: z.array(
              z.object({ id: SchemaUuid, name: SchemaString }),
            ),
            dateStart: SchemaDate,
            dateEnd: SchemaDate,
            createdAt: SchemaDatetime,
          }),
        ),
      }),
    ),
  }),
  async (c) => {
    const records = await ServiceReport.getAll(c.var);
    return c.json({ records });
  },
);

RouterReport.openapi(
  createRoute({
    method: "get",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseJson(
      z.object({
        id: SchemaUuid,
        title: SchemaPlainOrTranslatableText,
        config: SchemaReport,
        attachments: z.array(z.object({ id: SchemaUuid, name: SchemaString })),
        dateStart: SchemaDate,
        dateEnd: SchemaDate,
        status: SchemaMessageQueueTaskStatus,
        createdAt: SchemaDatetime,
      }),
    ),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const rec = await ServiceReport.get(c.var, param.id);
    return c.json(rec);
  },
);

RouterReport.openapi(
  createRoute({
    method: "get",
    path: "/output-file/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaString }),
    responses: UtilOpenApi.genResponseFile(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    const file = await ServiceReport.getFile(c.var, param.id);
    return UtilHono.resFile(c, file, {
      contentType: "application/pdf",
    });
  },
);

RouterReport.openapi(
  createRoute({
    method: "post",
    path: "/create",
    request: {
      headers: z.object({
        "accept-language": z.string().optional(),
      }),
      query: z.object({
        tz: z.string(),
      }),
      body: UtilOpenApi.genRequestJsonSub(
        z.object({
          report: SchemaReport,
          attachmentIds: UtilArray.zUniqueArray(SchemaUuid),
        }),
      ),
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
    const json = c.req.valid("json");

    await ServiceReportAttachment.checkOrgOwnership(c.var, json.attachmentIds);

    const id = await ServiceReport.create(
      c.var,
      json.report,
      json.attachmentIds,
      query.tz,
      header["accept-language"],
    );

    return c.json({ id });
  },
);

RouterReport.openapi(
  createRoute({
    method: "delete",
    path: "/item/{id}",
    request: UtilOpenApi.genRequestParam({ id: SchemaUuid }),
    responses: UtilOpenApi.genResponseNull(),
  }),
  async (c) => {
    const param = c.req.valid("param");
    await ServiceReport.remove(c.var, param.id);
    return UtilHono.resNull(c);
  },
);

UtilOpenApi.tag(RouterReport, "Module: Report");
