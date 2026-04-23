import { EApiFailCode, UtilDate } from "common";
import { and, eq, inArray } from "drizzle-orm";

import { INamedRecord } from "@m/analysis/interfaces/INameList";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg, IContextUser } from "@m/core/interfaces/IContext";
import { IStoragePath } from "@m/core/interfaces/IStoragePath";
import { MaybePromise } from "@m/core/interfaces/MaybePromise";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";
import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";
import { UtilDb } from "@m/core/utils/UtilDb";
import { UtilLanguage } from "@m/core/utils/UtilLanguage";
import { UtilTimezone } from "@m/core/utils/UtilTimezone";

import { CReportLayout } from "../components/CReportLayout";
import { IContextReport } from "../interfaces/IContextReport";
import { IReport } from "../interfaces/IReport";
import { TbReport } from "../orm/TbReport";
import { TbReportAttachment } from "../orm/TbReportAttachment";
import { UtilReport } from "../utils/UtilReport";
import { UtilReportFile } from "../utils/UtilReportFile";

export namespace ServiceReport {
  function generatePath(orgId: string, name: string) {
    return `/org-data/${orgId}/report/outputs/${name}` as IStoragePath;
  }

  export function renderHtml(
    c: IContextReport,
    report: IReport,
    options?: { withoutCss?: boolean },
  ) {
    return (
      <CReportLayout c={c} report={report} withoutCss={options?.withoutCss} />
    );
  }

  export async function getAll(c: IContextOrg) {
    const reports = await c.db
      .select({
        id: TbReport.id,
        title: TbReport.title,
        status: TbReport.status,
        attachments: TbReport.attachments,
        dateStart: TbReport.dateStart,
        dateEnd: TbReport.dateEnd,
        createdAt: UtilDb.isoDatetime(TbReport.createdAt),
      })
      .from(TbReport)
      .where(eq(TbReport.orgId, c.orgId))
      .orderBy(TbReport.createdAt);

    return reports;
  }

  export async function get(c: IContextOrg, id: string) {
    const [report] = await c.db
      .select({
        id: TbReport.id,
        title: TbReport.title,
        config: TbReport.config,
        status: TbReport.status,
        attachments: TbReport.attachments,
        dateStart: TbReport.dateStart,
        dateEnd: TbReport.dateEnd,
        createdAt: UtilDb.isoDatetime(TbReport.createdAt),
      })
      .from(TbReport)
      .where(and(eq(TbReport.id, id), eq(TbReport.orgId, c.orgId)));

    if (!report) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return report;
  }

  export async function getFile(c: IContextOrg, id: string) {
    const path = generatePath(c.orgId, id);
    const file = await c.storage.get(path);
    if (!file) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "Report not found.");
    }
    return file;
  }

  export async function create(
    c: IContextUser,
    report: IReport,
    attachmentIds: string[],
    timezone: string,
    lang?: string,
    // For dev purposes
    options?: {
      skipProducingMessage?: boolean;
    },
  ) {
    if (!report.dateStart || !report.dateEnd) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "There is no date for the report.",
      );
    }

    if (
      UtilDate.localIsoDateToObj(report.dateEnd) <
      UtilDate.localIsoDateToObj(report.dateStart)
    ) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "dateStart can't be lower than dateEnd.",
      );
    }

    const tzOffset = UtilTimezone.getTimezoneOffset(timezone);

    const contextReport = {
      ...c,
      orgId: c.orgId,
      i18n: await UtilLanguage.create(c, lang),
      tzOffset,
      config: UtilReport.convertDateRangeToDatetimeRange(
        report.dateStart,
        report.dateEnd,
      ),
    };

    const html = await renderHtml(contextReport, report);
    const htmlString = await (html.toString() as MaybePromise<string>);

    const attachmentFiles: string[] = [];
    const attachments: INamedRecord[] = [];

    if (attachmentIds.length > 0) {
      const recAttachments = await c.db
        .select({ id: TbReportAttachment.id, name: TbReportAttachment.name })
        .from(TbReportAttachment)
        .where(
          and(
            eq(TbReportAttachment.orgId, c.orgId),
            inArray(TbReportAttachment.id, attachmentIds),
          ),
        );

      for (const attachmentId of attachmentIds) {
        // recAttachments is not used directly for name list to preserve id
        //   list order
        const recAttachment = recAttachments.find((d) => d.id === attachmentId);
        if (!recAttachment) {
          throw new ApiException(
            EApiFailCode.NOT_FOUND,
            "Some report attachment records are missing.",
          );
        }
        attachments.push(recAttachment);

        const pdfPath = UtilReportFile.generateReportFilePath(
          c.orgId,
          attachmentId,
        );
        const pdf = await c.storage.get(pdfPath);
        if (!pdf) {
          throw new ApiException(
            EApiFailCode.NOT_FOUND,
            "Report attachment file is not found.",
          );
        }
        attachmentFiles.push(pdf.buffer.toString("base64"));
      }
    }

    // That escaped html was returning promise even if its type is not promise
    const [res] = await c.db
      .insert(TbReport)
      .values({
        orgId: c.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        title: report.title,
        config: report,
        attachments,
        dateStart: report.dateStart,
        dateEnd: report.dateEnd,
        status:
          options?.skipProducingMessage || !c.env.QUEUE_REPORT_RENDER
            ? "FAILED"
            : "PENDING",
        timezone,
      })
      .returning({ id: TbReport.id });

    if (options?.skipProducingMessage) {
      return res.id;
    }

    let failed = false;

    if (!c.env.QUEUE_REPORT_RENDER) {
      c.logger.error(
        "Report render job is not produced. Queue environment is not set.",
      );
      failed = true;
    } else {
      const message = Buffer.from(
        JSON.stringify({
          id: res.id,
          html: htmlString,
          pdfAttachments: attachmentFiles,
        }),
        "utf-8",
      );

      try {
        await ServiceMessageQueue.produce(c.env.QUEUE_REPORT_RENDER, message);
      } catch (err) {
        c.logger.error(
          { error: errorToObject(err) },
          "Producing report mq message failed.",
        );

        failed = true;
      }
    }

    if (failed) {
      await c.db
        .update(TbReport)
        .set({
          status: "FAILED",
        })
        .where(and(eq(TbReport.orgId, c.orgId), eq(TbReport.id, res.id)));
    }

    return res.id;
  }

  export async function save(c: IContextOrg, name: string, buffer: Buffer) {
    const path = generatePath(c.orgId, name);
    await c.storage.put(path, buffer, "application/pdf");
  }

  export async function remove(c: IContextOrg, id: string) {
    await c.db
      .delete(TbReport)
      .where(and(eq(TbReport.id, id), eq(TbReport.orgId, c.orgId)));

    await c.storage.removeIfExists(generatePath(c.orgId, id));
  }
}
