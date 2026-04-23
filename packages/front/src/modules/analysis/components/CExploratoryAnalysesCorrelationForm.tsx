import { Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { Api } from "@m/base/api/Api";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import { CFormFooter, CFormLine } from "@m/core/components/CFormPanel";
import {
  CQuickRangeSelect,
  ICQuickRangeValue,
} from "@m/core/components/CQuickRangeSelect";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { quickRangeToDatetimeRange } from "@m/core/utils/UtilQuickRange";
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
  const inputDatetimeRange = useInput<ICQuickRangeValue | undefined>();
  const datetimeRange = quickRangeToDatetimeRange(inputDatetimeRange.value);

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
    inputDatetimeRange.setValue({
      customMin: rerunData.datetimeStart,
      customMax: rerunData.datetimeEnd,
    });
  }, [inputMetricIds, inputDatetimeRange, rerunData]);

  const invalidDriverCount = useMemo(
    // If length is zero, do not register this invalid message.
    () => inputMetricIds.value && inputMetricIds.value.length === 1,
    [inputMetricIds.value],
  );
  const invalidForm = useInputInvalid(inputMetricIds);
  const invalidRange = Boolean(datetimeRange.invalidMsg);
  const invalid = invalidForm || invalidDriverCount || invalidRange;

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    const res = await Api.POST("/u/analysis/correlation/commit", {
      body: {
        metricIds: inputMetricIds.value,
        datetimeStart: datetimeRange?.datetimeMin ?? "",
        datetimeEnd: datetimeRange?.datetimeMax ?? "",
      },
    });

    apiToast(res, { NOT_FOUND: t("insufficientDataToProcess") });

    if (!res.error) {
      await onSubmitSuccess();
    }
  }, [invalid, datetimeRange, inputMetricIds, apiToast, onSubmitSuccess, t]);

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

        <CFormLine label={t("dateRange")} invalidMsg={datetimeRange.invalidMsg}>
          <CQuickRangeSelect
            value={inputDatetimeRange.value}
            onChange={inputDatetimeRange.onChange}
            invalid={invalidRange}
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
