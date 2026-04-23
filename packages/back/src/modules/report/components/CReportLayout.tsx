import { EApiFailCode, UtilDate } from "common";
import { PropsWithChildren } from "hono/jsx";

import { ServiceOrganization } from "@m/base/services/ServiceOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";

import { IContextReport } from "../interfaces/IContextReport";
import { IReport } from "../interfaces/IReport";
import { UtilDictionary } from "../utils/UtilDictionary";
import { CReportAuthors } from "./CReportAuthors";
import { CReportSections } from "./CReportSections";
import { CReportStyle } from "./CReportStyle";
import { CReportTableOfContents } from "./CReportTableOfContents";

export const CReportLayout = async ({
  c,
  report,
  withoutCss,
}: {
  c: IContextReport;
  report: IReport;
  withoutCss?: boolean;
}) => {
  if (!report.dateStart || !report.dateEnd) {
    throw new ApiException(
      EApiFailCode.BAD_REQUEST,
      "There is no date for the report.",
    );
  }

  const lang = c.i18n.getLanguage();

  const org = await ServiceOrganization.getUnsafe(c, c.orgId);

  return (
    <html lang={lang}>
      <head>
        <meta charset={"utf-8"}></meta>
        <title>{UtilDictionary.translateValue(c.i18n, report.title)}</title>
        {!withoutCss && <CReportStyle />}
      </head>
      <body>
        <CHeader
          title={`${UtilDictionary.translateValue(c.i18n, report.title)} - ${org.fullName}`}
        >
          <h1>{UtilDictionary.translateValue(c.i18n, report.title)}</h1>
          <div id="report-period-info">
            {c.i18n.t("dateStartPeriod")}:{" "}
            {UtilDate.formatUtcIsoDateToLocalDate(report.dateStart, lang)} -{" "}
            {c.i18n.t("dateEndPeriod")}:{" "}
            {UtilDate.formatUtcIsoDateToLocalDate(report.dateEnd, lang)}
          </div>

          {report.authorIds.length > 0 && (
            <CReportAuthors c={c} authorIds={report.authorIds} />
          )}

          <CReportTableOfContents c={c} sections={report.sections} />

          <CReportSections c={c} sections={report.sections} />
        </CHeader>
      </body>
    </html>
  );
};

const CHeader = async ({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) => {
  // This table is a print layout hack, thead repeats on each printed page
  return (
    <table class="report-header-table">
      <thead>
        <tr>
          <td>
            <div class="report-header">
              <div>{title}</div>
              <div>Reneryo</div>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="content">{children}</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
