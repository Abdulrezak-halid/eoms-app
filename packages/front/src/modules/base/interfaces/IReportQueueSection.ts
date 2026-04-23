import { IReportQueueSectionType } from "../constants/ReportQueueSectionTypes";

export type { IReportQueueSectionType } from "../constants/ReportQueueSectionTypes";

export interface IReportQueueSection {
  type: IReportQueueSectionType;
  createdAt: number;
}

export type IReportQueueSectionInput = Omit<IReportQueueSection, "createdAt">;
