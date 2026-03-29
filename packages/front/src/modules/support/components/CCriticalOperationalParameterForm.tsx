import { MAX_API_NUMBER_VALUE } from "common";
import { useCallback } from "react";

import { CComboboxOrganizationEnergyResource } from "@m/base/components/CComboboxOrganizationEnergyResource";
import { CComboboxPeriod } from "@m/base/components/CComboboxPeriod";
import { CComboboxUnit } from "@m/base/components/CComboboxUnit";
import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CComboboxSeu } from "@m/measurement/components/CComboboxSeu";

import {
  IDtoCriticalOperationalParameterRequest,
  IDtoCriticalOperationalParameterResponse,
} from "../interfaces/IDtoCriticalOperationalParameter";

export function CCriticalOperationalParameterForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoCriticalOperationalParameterResponse;
  onSubmit: (data: IDtoCriticalOperationalParameterRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputSeuId = useInput(initialData?.seu.id);
  const inputEnergyResource = useInput(initialData?.energyResource);
  const inputParameter = useInput(initialData?.parameter);
  const inputPeriod = useInput(initialData?.period);
  const inputUnit = useInput(initialData?.unit);
  const inputNormalSettingValue = useInput(initialData?.normalSettingValue);
  const inputLowerLimit = useInput(initialData?.lowerLimit);
  const inputUpperLimit = useInput(initialData?.upperLimit);
  const inputAccuracyCalibrationFrequency = useInput(
    initialData?.accuracyCalibrationFrequency,
  );
  const inputMeasurementTool = useInput(initialData?.measurementTool);
  const inputValueResponsibleUserId = useInput(
    initialData?.valueResponsibleUser.id,
  );
  const inputDeviationResponsibleUserId = useInput(
    initialData?.deviationResponsibleUser.id,
  );
  const inputNote = useInput(initialData?.note || "");
  const inputControlDate = useInput(initialData?.controlDate);

  const invalid = useInputInvalid(
    inputSeuId,
    inputEnergyResource,
    inputParameter,
    inputPeriod,
    inputUnit,
    inputNormalSettingValue,
    inputLowerLimit,
    inputUpperLimit,
    inputAccuracyCalibrationFrequency,
    inputMeasurementTool,
    inputValueResponsibleUserId,
    inputDeviationResponsibleUserId,
    inputNote,
    inputControlDate,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputSeuId.value ||
      !inputEnergyResource.value ||
      !inputParameter.value ||
      !inputPeriod.value ||
      !inputUnit.value ||
      !inputNormalSettingValue.value ||
      !inputLowerLimit.value ||
      !inputUpperLimit.value ||
      !inputAccuracyCalibrationFrequency.value ||
      !inputMeasurementTool.value ||
      !inputValueResponsibleUserId.value ||
      !inputDeviationResponsibleUserId.value ||
      !inputControlDate.value
    ) {
      return;
    }

    const body = {
      seuId: inputSeuId.value,
      energyResource: inputEnergyResource.value,
      parameter: inputParameter.value,
      period: inputPeriod.value,
      unit: inputUnit.value,
      normalSettingValue: inputNormalSettingValue.value,
      lowerLimit: inputLowerLimit.value,
      upperLimit: inputUpperLimit.value,
      accuracyCalibrationFrequency: inputAccuracyCalibrationFrequency.value,
      measurementTool: inputMeasurementTool.value,
      valueResponsibleUserId: inputValueResponsibleUserId.value,
      deviationResponsibleUserId: inputDeviationResponsibleUserId.value,
      note: inputNote.value || null,
      controlDate: inputControlDate.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputSeuId.value,
    inputEnergyResource.value,
    inputParameter.value,
    inputPeriod.value,
    inputUnit.value,
    inputNormalSettingValue.value,
    inputLowerLimit.value,
    inputUpperLimit.value,
    inputAccuracyCalibrationFrequency.value,
    inputMeasurementTool.value,
    inputValueResponsibleUserId.value,
    inputDeviationResponsibleUserId.value,
    inputNote.value,
    inputControlDate.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("significantEnergyUser")}
          invalidMsg={inputSeuId.invalidMsg}
        >
          <CComboboxSeu {...inputSeuId} required></CComboboxSeu>
        </CFormLine>

        <CFormLine
          label={t("parameter")}
          invalidMsg={inputParameter.invalidMsg}
        >
          <CInputString
            {...inputParameter}
            placeholder={t("parameter")}
            required
          />
        </CFormLine>

        <CFormLine label={t("period")} invalidMsg={inputPeriod.invalidMsg}>
          <CComboboxPeriod {...inputPeriod} required />
        </CFormLine>

        <CFormLine
          label={t("energyResource")}
          invalidMsg={inputEnergyResource.invalidMsg}
        >
          <CComboboxOrganizationEnergyResource
            {...inputEnergyResource}
            required
          />
        </CFormLine>

        <CFormLine label={t("unit")} invalidMsg={inputUnit.invalidMsg}>
          <CComboboxUnit {...inputUnit} required />
        </CFormLine>

        <CFormLine
          label={t("normalSettingValue")}
          invalidMsg={inputNormalSettingValue.invalidMsg}
        >
          <CInputNumber
            {...inputNormalSettingValue}
            placeholder={t("normalSettingValue")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("lowerLimit")}
          invalidMsg={inputLowerLimit.invalidMsg}
        >
          <CInputNumber
            {...inputLowerLimit}
            placeholder={t("lowerLimit")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("upperLimit")}
          invalidMsg={inputUpperLimit.invalidMsg}
        >
          <CInputNumber
            {...inputUpperLimit}
            placeholder={t("upperLimit")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("accuracyCalibrationFrequency")}
          invalidMsg={inputAccuracyCalibrationFrequency.invalidMsg}
        >
          <CInputNumber
            {...inputAccuracyCalibrationFrequency}
            placeholder={t("accuracyCalibrationFrequency")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("measurementTool")}
          invalidMsg={inputMeasurementTool.invalidMsg}
        >
          <CInputString
            {...inputMeasurementTool}
            placeholder={t("measurementTool")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("valueResponsibleUser")}
          invalidMsg={inputValueResponsibleUserId.invalidMsg}
        >
          <CComboboxUser {...inputValueResponsibleUserId} required />
        </CFormLine>

        <CFormLine
          label={t("deviationResponsibleUser")}
          invalidMsg={inputDeviationResponsibleUserId.invalidMsg}
        >
          <CComboboxUser {...inputDeviationResponsibleUserId} required />
        </CFormLine>

        <CFormLine
          label={t("controlDate")}
          invalidMsg={inputControlDate.invalidMsg}
        >
          <CInputDate
            {...inputControlDate}
            placeholder={t("controlDate")}
            required
          />
        </CFormLine>

        <CFormLine label={t("note")} invalidMsg={inputNote.invalidMsg}>
          <CInputTextarea {...inputNote} placeholder={t("note")} />
        </CFormLine>
        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
