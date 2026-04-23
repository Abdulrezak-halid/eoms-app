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
