import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoMeasurementPlanCopRequest,
  IDtoMeasurementPlanCopResponse,
} from "../interfaces/IDtoMeasurementPlanCop";

export function CMeasurementPlanCopForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoMeasurementPlanCopResponse;
  onSubmit: (data: IDtoMeasurementPlanCopRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputEnergyVariables = useInput(initialData?.energyVariables);
  const inputOptimalMeasurementTools = useInput(
    initialData?.optimalMeasurementTools,
  );
  const inputAvailableMeasurementTools = useInput(
    initialData?.availableMeasurementTools,
  );
  const inputMonitoringAbsenceGap = useInput(initialData?.monitoringAbsenceGap);
  const inputMeasurementPlan = useInput(initialData?.measurementPlan);

  const invalid = useInputInvalid(
    inputEnergyVariables,
    inputOptimalMeasurementTools,
    inputAvailableMeasurementTools,
    inputMonitoringAbsenceGap,
    inputMeasurementPlan,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputEnergyVariables.value ||
      !inputOptimalMeasurementTools.value ||
      !inputAvailableMeasurementTools.value ||
      !inputMonitoringAbsenceGap.value ||
      !inputMeasurementPlan.value
    ) {
      return;
    }

    const body = {
      energyVariables: inputEnergyVariables.value,
      optimalMeasurementTools: inputOptimalMeasurementTools.value,
      availableMeasurementTools: inputAvailableMeasurementTools.value,
      monitoringAbsenceGap: inputMonitoringAbsenceGap.value,
      measurementPlan: inputMeasurementPlan.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputEnergyVariables.value,
    inputOptimalMeasurementTools.value,
    inputAvailableMeasurementTools.value,
    inputMonitoringAbsenceGap.value,
    inputMeasurementPlan.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("energyVariables")}
          invalidMsg={inputEnergyVariables.invalidMsg}
        >
          <CInputString
            {...inputEnergyVariables}
            placeholder={t("energyVariables")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("optimalMeasurementTools")}
          invalidMsg={inputOptimalMeasurementTools.invalidMsg}
        >
          <CInputString
            {...inputOptimalMeasurementTools}
            placeholder={t("optimalMeasurementTools")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("availableMeasurementTools")}
          invalidMsg={inputAvailableMeasurementTools.invalidMsg}
        >
          <CInputString
            {...inputAvailableMeasurementTools}
            placeholder={t("availableMeasurementTools")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("monitoringAbsenceGap")}
          invalidMsg={inputMonitoringAbsenceGap.invalidMsg}
        >
          <CInputString
            {...inputMonitoringAbsenceGap}
            placeholder={t("monitoringAbsenceGap")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("measurementPlans")}
          invalidMsg={inputMeasurementPlan.invalidMsg}
        >
          <CInputString
            {...inputMeasurementPlan}
            placeholder={t("measurementPlans")}
            required
          />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
