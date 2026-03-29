import { useCallback, useMemo } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CMultiSelectMetric } from "@m/measurement/components/CMultiSelectMetric";

import {
  IDtoAccessTokenRequest,
  IDtoAccessTokenResponse,
} from "../interfaces/IDtoAccessToken";

export function CAccessTokenForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoAccessTokenResponse;
  onSubmit: (data: IDtoAccessTokenRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const initialMetricIds = useMemo(
    () =>
      initialData?.permissions.metricResourceValueMetrics.map((m) => m.id) ||
      [],
    [initialData],
  );

  const inputName = useInput(initialData?.name);
  const inputMetricsIds = useInput<string[]>(initialMetricIds);
  const inputCanListMetrics = useInput<boolean>(
    initialData?.permissions.canListMetrics ?? false,
  );
  const inputCanListMeters = useInput<boolean>(
    initialData?.permissions.canListMeters ?? false,
  );
  const inputCanListSeus = useInput<boolean>(
    initialData?.permissions.canListSeus ?? false,
  );

  const invalid = useInputInvalid(inputName, inputMetricsIds);

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputName.value || !inputMetricsIds.value) {
      return;
    }

    await onSubmit({
      name: inputName.value,
      permissions: {
        metricResourceValueMetricIds: inputMetricsIds.value || [],
        canListMetrics: inputCanListMetrics.value ?? false,
        canListMeters: inputCanListMeters.value ?? false,
        canListSeus: inputCanListSeus.value ?? false,
      },
    });
  }, [
    invalid,
    inputName.value,
    inputMetricsIds.value,
    inputCanListMetrics.value,
    inputCanListMeters.value,
    inputCanListSeus.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine
          label={t("metricValues")}
          invalidMsg={inputMetricsIds.invalidMsg}
        >
          <CMultiSelectMetric {...inputMetricsIds} />
        </CFormLine>

        <CFormLine label={t("permissions")}>
          <div className="space-y-2">
            <CCheckbox
              label={t("canListMetrics")}
              selected={inputCanListMetrics.value}
              onChange={inputCanListMetrics.onChange}
            />
            <CCheckbox
              label={t("canListMeters")}
              selected={inputCanListMeters.value}
              onChange={inputCanListMeters.onChange}
            />
            <CCheckbox
              label={t("canListSeus")}
              selected={inputCanListSeus.value}
              onChange={inputCanListSeus.onChange}
            />
          </div>
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
