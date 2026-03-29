import { IContextReport } from "../interfaces/IContextReport";
import { IReportSection } from "../interfaces/IReportSection";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";

export const CReportTableOfContents = ({
  c,
  sections,
}: {
  c: IContextReport;
  sections: IReportSection[];
}) => {
  return (
    <div id="table-of-contents">
      <h2>{c.i18n.t("tableOfContents")}</h2>

      <ul>
        {sections.map((section, index) => {
          const sectionNumber = UtilReport.calculateSectionNumber(
            sections,
            index,
          );

          return (
            <li key={`toc-${index}`}>
              <a href={`#section-${sectionNumber.slice(0, -1)}`}>
                {sectionNumber}{" "}
                {section.title &&
                  UtilDictionary.translateValue(c.i18n, section.title)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
