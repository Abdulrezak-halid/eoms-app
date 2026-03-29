/**
 * @file: IDtoReportSectionWithState.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoReportSectionData } from "./IDtoReport";

export type IReportSection = {
  id: number;
  sectionNumber?: string;
  invalid?: boolean;
  data: IDtoReportSectionData;
};
