import { useCallback, useEffect, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CTable } from "@m/core/components/CTable";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";
import { CBadgeMeterSlice } from "@m/measurement/components/CBadgeMeterSlice";
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";
import { customTableConverterRegressionAnalysis } from "../utils/customTableConverterRegressionAnalysis";
import { CButtonReportSectionCustomTableConverter } from "./CButtonReportSectionCustomTableConverter";
import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionRegressionAnalysisTable({
  content,
  onChange,
  datetimeRange,
}: {
  content?: Extract<
    IDtoReportSectionContent,
    { type: "REGRESSION_ANALYSIS_TABLE" }
  >;
  onChange: (value: IDtoReportSectionContent) => void;
  datetimeRange?: IDatetimeRange;
}) {
  const { t } = useTranslation();

  const [primary, setPrimary] = useState(content?.primary ?? true);

  useEffect(() => {
    onChange({ type: "REGRESSION_ANALYSIS_TABLE", primary });
  }, [onChange, primary]);

  const fetcher = useCallback(async () => {
    if (!primary && !datetimeRange) {
      return;
    }
    return await Api.GET("/u/analysis/advanced-regression/result", {
      params: {
        query: {
          primary: primary ? "true" : undefined,
          ...(!primary ? datetimeRange : {}),
        },
      },
    });
  }, [datetimeRange, primary]);

  const [data] = useLoader(fetcher);

  const header = useMemo(
    () => [
      { label: t("significantEnergyUser") },
      { label: t("driver") },
      { label: t("rsquared"), right: true },
      { label: t("rootMeanSquareError"), right: true },
    ],
    [t],
  );

  return (
    <div className="space-y-3">
      <CFormPanel>
        <CFormLine label={t("usePrimaryRecords")}>
          <CCheckbox selected={primary} onChange={setPrimary} />
        </CFormLine>
      </CFormPanel>

      {!primary && !datetimeRange ? (
        <CMessageSelectDateRange />
      ) : (
        <CAsyncLoader data={data} arrayField="records" showSpinnerDuringNoFetch>
          {(payload) => (
            <div className="space-y-3">
              <CButtonReportSectionCustomTableConverter
                data={payload.records}
                converter={customTableConverterRegressionAnalysis}
                onChange={onChange}
              />

              <CTable header={header} bordered>
                {payload.records.map((record, index) => [
                  record.seu ? (
                    <CBadgeSeu key="seu" value={record.seu.name} wrap />
                  ) : (
                    <CGridBadge key="seu">
                      {record.slices.map((slice) => (
                        <CBadgeMeterSlice key={slice.id} value={slice.name} />
                      ))}
                    </CGridBadge>
                  ),

                  <CGridBadge key="drivers">
                    {record.drivers.map((d) => (
                      <CBadgeMetric key={d.id} value={d.name} wrap />
                    ))}
                  </CGridBadge>,

                  <CDisplayNumber
                    key={`rSquared-${index}`}
                    value={record.rSquared}
                  />,

                  <CDisplayNumber key={`rmse-${index}`} value={record.rmse} />,
                ])}
              </CTable>
            </div>
          )}
        </CAsyncLoader>
      )}
    </div>
  );
}
