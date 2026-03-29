import { EApiFailCode } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";

import { IContextReport } from "../interfaces/IContextReport";
import { IReportSection } from "../interfaces/IReportSection";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";
import { CReportSectionContent } from "./CReportSectionContent";

export const CReportSections = ({
  c,
  sections,
}: {
  c: IContextReport;
  sections: IReportSection[];
}) => {
  return (
    <>
      {sections.map((section, i) => {
        const sectionNumber = UtilReport.calculateSectionNumber(sections, i);

        if (section.title.type === "PLAIN" && section.title.value === "") {
          throw new ApiException(
            EApiFailCode.BAD_REQUEST,
            "Report title is forgotten.",
          );
        }

        const sectionContext: IContextReport = {
          ...c,
          config: {
            ...c.config,
            ...(section.customDate
              ? UtilReport.convertDateRangeToDatetimeRange(
                  section.customDate.start,
                  section.customDate.end,
                )
              : undefined),
          },
        };

        return (
          <div
            key={`sec-${i}`}
            id={`section-${sectionNumber.slice(0, -1)}`}
            class="section"
          >
            <div class="section-title">
              {sectionNumber}{" "}
              {UtilDictionary.translateValue(c.i18n, section.title)}
            </div>

            {section.content && (
              <CReportSectionContent
                c={sectionContext}
                content={section.content}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
