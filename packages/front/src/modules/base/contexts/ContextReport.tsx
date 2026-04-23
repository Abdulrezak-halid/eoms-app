import { createContext } from "react";

import { IReportQueueSectionType } from "../constants/ReportQueueSectionTypes";
import {
  IReportQueueSection,
  IReportQueueSectionInput,
} from "../interfaces/IReportQueueSection";

export const ContextReport = createContext<{
  sections: IReportQueueSection[];
  addSection: (section: IReportQueueSectionInput) => boolean;
  removeSectionByType: (type: IReportQueueSectionType) => void;
  removeSectionsByType: (types: IReportQueueSectionType[]) => void;
  clearSections: () => void;
  hasSectionType: (type: IReportQueueSectionType) => boolean;
}>({
  sections: [],
  addSection: () => false,
  removeSectionByType: () => {},
  removeSectionsByType: () => {},
  clearSections: () => {},
  hasSectionType: () => false,
});
