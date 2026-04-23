import { MAX_API_NUMBER_VALUE } from "common";
import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxEnPi } from "@m/analysis/components/CComboboxEnPi";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoMeasurementPlanEnpiRequest,
  IDtoMeasurementPlanEnpiResponse,
} from "../interfaces/IDtoMeasurementPlanEnpi";

export function CMeasurementPlanEnpiForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoMeasurementPlanEnpiResponse;
  onSubmit: (data: IDtoMeasurementPlanEnpiRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputEnpiId = useInput(initialData?.enpi.id);
  const inputEnergyInput = useInput(initialData?.energyInput);
  const inputEnergyVariables = useInput(initialData?.energyVariables);
  const inputIdealMeasurementTools = useInput(
    initialData?.idealMeasurementTools,
  );
  const inputAvailableMeasurementTools = useInput(
    initialData?.availableMeasurementTools,
  );
  const inputMonitoringAbsenceGap = useInput(initialData?.monitoringAbsenceGap);
  const inputMeasurementPlan = useInput(initialData?.measurementPlan);
  const inputRequiredRange = useInput(initialData?.requiredRange);
  const inputEngineeringUnit = useInput(initialData?.engineeringUnit);
  const inputDataCollectionMethod = useInput(initialData?.dataCollectionMethod);
  const inputDataCollectionPeriod = useInput(initialData?.dataCollectionPeriod);

  const invalid = useInputInvalid(
    inputEnpiId,
    inputEnergyInput,
    inputEnergyVariables,
    inputIdealMeasurementTools,
    inputAvailableMeasurementTools,
    inputMonitoringAbsenceGap,
    inputMeasurementPlan,
    inputRequiredRange,
    inputEngineeringUnit,
    inputDataCollectionMethod,
    inputDataCollectionPeriod,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputEnpiId.value ||
      !inputEnergyInput.value ||
      !inputEnergyVariables.value ||
      !inputIdealMeasurementTools.value ||
      !inputAvailableMeasurementTools.value ||
      !inputMonitoringAbsenceGap.value ||
      !inputMeasurementPlan.value ||
      !inputRequiredRange.value ||
      !inputEngineeringUnit.value ||
      !inputDataCollectionMethod.value ||
      !inputDataCollectionPeriod.value
    ) {
      return;
    }

    const body = {
      enpiId: inputEnpiId.value,
      energyInput: inputEnergyInput.value,
      energyVariables: inputEnergyVariables.value,
      idealMeasurementTools: inputIdealMeasurementTools.value,
      availableMeasurementTools: inputAvailableMeasurementTools.value,
      monitoringAbsenceGap: inputMonitoringAbsenceGap.value,
      measurementPlan: inputMeasurementPlan.value,
      requiredRange: inputRequiredRange.value,
      engineeringUnit: inputEngineeringUnit.value,
      dataCollectionMethod: inputDataCollectionMethod.value,
      dataCollectionPeriod: inputDataCollectionPeriod.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputEnpiId.value,
    inputEnergyInput.value,
    inputEnergyVariables.value,
    inputIdealMeasurementTools.value,
    inputAvailableMeasurementTools.value,
    inputMonitoringAbsenceGap.value,
    inputMeasurementPlan.value,
    inputRequiredRange.value,
    inputEngineeringUnit.value,
    inputDataCollectionMethod.value,
    inputDataCollectionPeriod.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("enpi")} invalidMsg={inputEnpiId.invalidMsg}>
          <CComboboxEnPi {...inputEnpiId} required />
        </CFormLine>

        <CFormLine
          label={t("energyInput")}
          invalidMsg={inputEnergyInput.invalidMsg}
        >
          <CInputNumber
            {...inputEnergyInput}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            placeholder={t("energyInput")}
            required
          />
        </CFormLine>

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
          label={t("idealMeasurementTools")}
          invalidMsg={inputIdealMeasurementTools.invalidMsg}
        >
          <CInputString
            {...inputIdealMeasurementTools}
            placeholder={t("idealMeasurementTools")}
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

        <CFormLine
          label={t("requiredRange")}
          invalidMsg={inputRequiredRange.invalidMsg}
        >
          <CInputNumber
            {...inputRequiredRange}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            placeholder={t("requiredRange")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("engineeringUnit")}
          invalidMsg={inputEngineeringUnit.invalidMsg}
        >
          <CInputString
            {...inputEngineeringUnit}
            placeholder={t("engineeringUnit")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("dataCollectionMethod")}
          invalidMsg={inputDataCollectionMethod.invalidMsg}
        >
          <CInputString
            {...inputDataCollectionMethod}
            placeholder={t("dataCollectionMethod")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("dataCollectionPeriod")}
          invalidMsg={inputDataCollectionPeriod.invalidMsg}
        >
          <CInputString
            {...inputDataCollectionPeriod}
            placeholder={t("dataCollectionPeriod")}
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
