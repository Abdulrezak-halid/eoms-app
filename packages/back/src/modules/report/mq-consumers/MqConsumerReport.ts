import { z } from "@hono/zod-openapi";
import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore } from "@m/core/interfaces/IContext";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { ServiceNotification } from "@m/core/services/ServiceNotification";

import { TbReport } from "../orm/TbReport";
import { ServiceReport } from "../services/ServiceReport";

export async function MqConsumerReport(c: IContextCore, message: Buffer) {
  let id: string | undefined;

  try {
    const json = JSON.parse(message.toString());

    // Early parse id field to set status failed in case of object schema is
    //   invalid
    if (json && typeof json === "object" && "id" in json) {
      id = json.id;
    }

    const parsed = z
      .object({
        id: SchemaUuid,
        pdfContent: z.string(),
      })
      .parse(json);

    id = parsed.id;
    const pdfBuffer = Buffer.from(parsed.pdfContent, "base64");

    const [report] = await c.db
      .select({
        orgId: TbReport.orgId,
        createdBy: TbReport.createdBy,
        title: TbReport.title,
      })
      .from(TbReport)
      .where(eq(TbReport.id, id));

    if (!report) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    await ServiceReport.save({ ...c, orgId: report.orgId }, id, pdfBuffer);

    await c.db
      .update(TbReport)
      .set({
        status: "SUCCESS",
      })
      .where(and(eq(TbReport.id, id), eq(TbReport.orgId, report.orgId)));

    c.logger.info(
      { reportId: id },
      "Report PDF saved and status updated successfully.",
    );

    await ServiceNotification.notifyUser(c, report.orgId, report.createdBy, {
      type: "REPORT_RENDER_COMPLETED",
      reportId: id,
      reportTitle: report.title,
    });
  } catch (e) {
    if (id) {
      await c.db
        .update(TbReport)
        .set({
          status: "FAILED",
        })
        .where(eq(TbReport.id, id));
    }

    c.logger.error(
      {
        reportId: id,
        error: errorToObject(e),
      },
      "Failed to process report.",
    );

    throw e;
  }
}
