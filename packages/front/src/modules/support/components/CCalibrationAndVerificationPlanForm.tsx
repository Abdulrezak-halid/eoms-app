import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import {
  IDtoCalibrationPlanRequest,
  IDtoCalibrationPlanResponse,
} from "@m/support/interfaces/IDtoCalibrationPlan";

export function CCalibrationAndVerificationPlanForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoCalibrationPlanResponse;
  onSubmit: (data: IDtoCalibrationPlanRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputDeviceType = useInput(initialData?.deviceType);
  const inputDeviceNo = useInput(initialData?.deviceNo);
  const inputBrand = useInput(initialData?.brand);
  const inputLocation = useInput(initialData?.location);
  const inputCalibration = useInput(initialData?.calibration);
  const inputCalibrationNo = useInput(initialData?.calibrationNo);
  const inputResponsibleUser = useInput(initialData?.responsibleUser.id);
  const inputDueTo = useInput(initialData?.dueTo);
  const inputNextDate = useInput(initialData?.nextDate);
  const inputEvaluationResult = useInput(initialData?.evaluationResult);

  const invalid = useInputInvalid(
    inputDeviceType,
    inputDeviceNo,
    inputBrand,
    inputLocation,
    inputCalibration,
    inputCalibrationNo,
    inputResponsibleUser,
    inputDueTo,
    inputNextDate,
    inputEvaluationResult,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputDeviceType.value ||
      !inputDeviceNo.value ||
      !inputBrand.value ||
      !inputLocation.value ||
      !inputCalibration.value ||
      !inputResponsibleUser.value ||
      !inputDueTo.value ||
      !inputNextDate.value ||
      !inputEvaluationResult
    ) {
      return;
    }

    const body = {
      deviceType: inputDeviceType.value,
      deviceNo: inputDeviceNo.value,
      brand: inputBrand.value,
      location: inputLocation.value,
      calibration: inputCalibration.value,
      calibrationNo: inputCalibrationNo.value || "",
      responsibleUserId: inputResponsibleUser.value,
      dueTo: inputDueTo.value,
      nextDate: inputNextDate.value,
      evaluationResult: inputEvaluationResult.value || "",
    };

    await onSubmit(body);
  }, [
    invalid,
    inputDeviceType.value,
    inputDeviceNo.value,
    inputBrand.value,
    inputLocation.value,
    inputCalibration.value,
    inputCalibrationNo.value,
    inputResponsibleUser.value,
    inputDueTo.value,
    inputNextDate.value,
    inputEvaluationResult,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("deviceType")}
          invalidMsg={inputDeviceType.invalidMsg}
        >
          <CInputString
            {...inputDeviceType}
            placeholder={t("deviceType")}
            required
          />
        </CFormLine>

        <CFormLine label={t("deviceNo")} invalidMsg={inputDeviceNo.invalidMsg}>
          <CInputString
            {...inputDeviceNo}
            placeholder={t("deviceNo")}
            required
          />
        </CFormLine>

        <CFormLine label={t("brand")} invalidMsg={inputBrand.invalidMsg}>
          <CInputString {...inputBrand} placeholder={t("brand")} required />
        </CFormLine>

        <CFormLine label={t("location")} invalidMsg={inputLocation.invalidMsg}>
          <CInputString
            {...inputLocation}
            placeholder={t("location")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("calibration")}
          invalidMsg={inputCalibration.invalidMsg}
        >
          <CInputString
            {...inputCalibration}
            placeholder={t("calibration")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("calibrationNo")}
          invalidMsg={inputCalibrationNo.invalidMsg}
        >
          <CInputString
            {...inputCalibrationNo}
            placeholder={t("calibrationNo")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("responsibleUser")}
          invalidMsg={inputResponsibleUser.invalidMsg}
        >
          <CComboboxUser {...inputResponsibleUser} required />
        </CFormLine>

        <CFormLine label={t("dueTo")} invalidMsg={inputDueTo.invalidMsg}>
          <CInputDate {...inputDueTo} placeholder={t("dueTo")} required />
        </CFormLine>

        <CFormLine label={t("nextDate")} invalidMsg={inputNextDate.invalidMsg}>
          <CInputDate {...inputNextDate} placeholder={t("nextDate")} required />
        </CFormLine>

        <CFormLine
          label={t("evaluationResult")}
          invalidMsg={inputEvaluationResult.invalidMsg}
        >
          <CInputString
            {...inputEvaluationResult}
            placeholder={t("evaluationResult")}
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
