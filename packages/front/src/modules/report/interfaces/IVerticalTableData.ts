/**
 * @file: IVerticalTableData.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 21.01.2026
 * Last Modified Date: 21.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoReportSectionContent } from "./IDtoReport";

export type IVerticalTableData = Extract<
  IDtoReportSectionContent,
  { type: "TABLE_VERTICAL" }
>["data"];
