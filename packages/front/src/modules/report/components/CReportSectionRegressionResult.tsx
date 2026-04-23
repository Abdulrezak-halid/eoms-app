import { useEffect } from "react";

import { CComboboxRegressionResult } from "@m/analysis/components/CComboboxRegressionResult";
import { useFetchRegressionResult } from "@m/analysis/hooks/useFetchRegressionResult";
import { CChart } from "@m/base/components/CChart";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoReportSectionContent } from "../interfaces/IDtoReport";

export function CReportSectionRegressionResult({
  resultId,
  onChange,
  onInvalidChange,
}: {
  resultId?: string;
  onChange: (value: IDtoReportSectionContent) => void;
  onInvalidChange: (value: boolean) => void;
}) {
  const inputResultId = useInput(resultId);
  const invalid = useInputInvalid(inputResultId);

  useEffect(() => {
    onInvalidChange(invalid);
  }, [invalid, onInvalidChange]);

  useEffect(() => {
    onChange({ type: "REGRESSION_RESULT", resultId: inputResultId.value });
  }, [inputResultId.value, onChange]);

  const [chartData] = useFetchRegressionResult(inputResultId.value);

  const { t } = useTranslation();

  return (
    <>
      <CFormPanel>
        <CFormLine
          label={t("regressionResult")}
          invalidMsg={inputResultId.invalidMsg}
        >
          <CComboboxRegressionResult {...inputResultId} required />
        </CFormLine>
      </CFormPanel>

      {inputResultId.value && (
        <>
          <CFormTitle value={t("regressionResult")} />

          <CAsyncLoader data={chartData} showSpinnerDuringNoFetch>
            {(payload) => (
              <div className="space-y-4">
                <div>
                  <CChart
                    series={payload.mainSeries}
                    type="line"
                    unitStr={payload.unitAbbr}
                    disableInteractiveLegend
                  />
                </div>

                <div>
                  <CChart
                    series={payload.cumulativeSeries}
                    type="line"
                    unitStr={payload.unitAbbr}
                    disableInteractiveLegend
                  />
                </div>
              </div>
            )}
          </CAsyncLoader>
        </>
      )}
    </>
  );
}
