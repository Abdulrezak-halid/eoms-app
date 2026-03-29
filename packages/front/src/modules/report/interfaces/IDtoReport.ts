/**
 * @file: IDtoReport.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  IDtoPlainOrTranslatableText,
  IDtoReport,
} from "common/build-api-schema";

import { InferApiGetResponse } from "@m/base/api/Api";

export type IDtoReportListItem =
  InferApiGetResponse<"/u/report/item">["records"][number];

export type IDtoReportSectionData = IDtoReport["sections"][number];

export type IDtoReportSectionContent = IDtoReportSectionData["content"];

// Do not include internal dev test custom sections
export type IDtoReportSectionType = Exclude<
  NonNullable<IDtoReportSectionData["content"]>["type"],
  "CHART_CUSTOM" | "HEATMAP_CUSTOM" | "PIE_CHART_CUSTOM"
>;

export type IReportFormData = {
  templateDescription?: IDtoPlainOrTranslatableText;
  content: IDtoReport;
  attachmentIds?: string[];
};

export type IReportFormInitialData = {
  templateDescription?: IDtoPlainOrTranslatableText;
  content: IDtoReport;
  attachments?: { id: string; name: string }[];
};
