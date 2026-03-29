/**
 * @file: IReportSectionVerticalTable.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoReportSectionContent } from "./IDtoReport";

export type IDtoReportSectionVerticalTable = Extract<
  IDtoReportSectionContent,
  { type: "TABLE_VERTICAL" }
>;

export type IDtoReportSectionVerticalTableHeader = NonNullable<
  IDtoReportSectionVerticalTable["data"]
>["headers"][number];

export type IDtoReportSectionVerticalTableColumnType =
  IDtoReportSectionVerticalTableHeader["valueType"];

export type IDtoReportSectionVerticalTableCell = NonNullable<
  IDtoReportSectionVerticalTable["data"]
>["rows"][number][number];

export type IHeaderWithId = {
  id: number;
  data: IDtoReportSectionVerticalTableHeader;
};
export type IRowWithId = {
  id: number;
  data: IDtoReportSectionVerticalTableCell[];
};
