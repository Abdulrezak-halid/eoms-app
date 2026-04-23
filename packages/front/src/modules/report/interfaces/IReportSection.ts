import { IDtoReportSectionData } from "./IDtoReport";

export type IReportSection = {
  id: number;
  sectionNumber?: string;
  invalid?: boolean;
  data: IDtoReportSectionData;
};
