import { IDtoReportSectionContent } from "./IDtoReport";

export type IVerticalTableData = Extract<
  IDtoReportSectionContent,
  { type: "TABLE_VERTICAL" }
>["data"];
