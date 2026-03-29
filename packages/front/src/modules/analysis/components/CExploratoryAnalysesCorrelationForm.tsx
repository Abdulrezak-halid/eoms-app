import { useCallback, useEffect, useMemo, useRef } from "react";
import { Play } from "lucide-react";

import { Api } from "@m/base/api/Api";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import { CFormFooter, CFormLine } from "@m/core/components/CFormPanel";
import { CInputDatetime } from "@m/core/components/CInputDatetime";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CMultiSelectMetric } from "@m/measurement/components/CMultiSelectMetric";

import { IDtoCorrelationResultItem } from "../interfaces/IDtoExploratoryAnalyses";

export function CExploratoryAnalysesCorrelationForm({
  onSubmitSuccess,
  rerunData,
}: {
  onSubmitSuccess: () => Promise<void>;
  rerunData?: IDtoCorrelationResultItem | null;
}) {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const inputMetricIds = useInput<string[]>([]);
  const inputdatetimeStart = useInput<string>();
  const inputdatetimeEnd = useInput<string>();

  const lastLoadedRerunId = useRef<string | null>(null);

  useEffect(() => {
    if (!rerunData) {
      lastLoadedRerunId.current = null;
      return;
    }

    if (rerunData.id === lastLoadedRerunId.current) {
      return;
    }

    lastLoadedRerunId.current = rerunData.id;

    inputMetricIds.setValue(rerunData.metrics.map((d) => d.id));
    inputdatetimeStart.setValue(rerunData.datetimeStart);
    inputdatetimeEnd.setValue(rerunData.datetimeEnd);
  }, [inputMetricIds, inputdatetimeStart, inputdatetimeEnd, rerunData]);

  const invalidDriverCount = useMemo(
    // If length is zero, do not register this invalid message.
    () => inputMetricIds.value && inputMetricIds.value.length === 1,
    [inputMetricIds.value],
  );
  const invalidForm = useInputInvalid(
    inputMetricIds,
    inputdatetimeStart,
    inputdatetimeEnd,
  );
  const invalid = invalidForm || invalidDriverCount;

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    const res = await Api.POST("/u/analysis/correlation/commit", {
      body: {
        metricIds: inputMetricIds.value,
        datetimeStart: inputdatetimeStart.value ?? "",
        datetimeEnd: inputdatetimeEnd.value ?? "",
      },
    });

    apiToast(res, { NOT_FOUND: t("insufficientDataToProcess") });

    if (!res.error) {
      await onSubmitSuccess();
    }
  }, [
    invalid,
    inputMetricIds,
    inputdatetimeStart,
    inputdatetimeEnd,
    apiToast,
    onSubmitSuccess,
    t,
  ]);

  const invalidMsg =
    inputMetricIds.invalidMsg ||
    (invalidDriverCount ? t("msgNeedToSelectAtLeastTwoDrivers") : "");

  return (
    <CForm onSubmit={handleSubmit} className="mb-4">
      <div className="space-y-2">
        <CFormLine label={t("drivers")} invalidMsg={invalidMsg}>
          <CMultiSelectMetric
            {...inputMetricIds}
            invalid={invalidDriverCount}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datetimeStart")}
          invalidMsg={inputdatetimeStart.invalidMsg}
        >
          <CInputDatetime
            {...inputdatetimeStart}
            max={inputdatetimeEnd.value}
            placeholder={t("datetimeStart")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("datetimeEnd")}
          invalidMsg={inputdatetimeEnd.invalidMsg}
        >
          <CInputDatetime
            {...inputdatetimeEnd}
            min={inputdatetimeStart.value}
            placeholder={t("datetimeEnd")}
            required
          />
        </CFormLine>

        <CFormFooter>
          <CButton
            icon={Play}
            primary
            label={t("run")}
            onClick={handleSubmit}
            disabled={invalid}
          />
        </CFormFooter>
      </div>
    </CForm>
  );
}
