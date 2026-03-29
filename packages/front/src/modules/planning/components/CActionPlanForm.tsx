import { useCallback } from "react";

import { CComboboxDocumentApprovementStatus } from "@m/base/components/CComboboxDocumentApprovementStatus";
import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoActionPlanRequest,
  IDtoActionPlanResponse,
} from "../interfaces/IDtoActionPlan";

export function CActionPlanForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoActionPlanResponse;
  onSubmit: (data: IDtoActionPlanRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputReasonsForStatus = useInput(initialData?.reasonsForStatus);
  const inputActualSavingsVerifications = useInput(
    initialData?.actualSavingsVerifications,
  );
  const inputActualSavings = useInput(initialData?.actualSavings);
  const inputStartDate = useInput(initialData?.startDate);
  const inputTargetIdentificationDate = useInput(
    initialData?.targetIdentificationDate,
  );
  const inputActualIdentificationDate = useInput(
    initialData?.actualIdentificationDate,
  );
  const inputApprovementStatus = useInput(initialData?.approvementStatus);
  const inputResponsibleUserId = useInput(initialData?.responsibleUser.id);

  const invalid = useInputInvalid(
    inputName,
    inputReasonsForStatus,
    inputActualSavingsVerifications,
    inputActualSavings,
    inputStartDate,
    inputTargetIdentificationDate,
    inputActualIdentificationDate,
    inputApprovementStatus,
    inputResponsibleUserId,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputReasonsForStatus.value ||
      !inputActualSavingsVerifications.value ||
      !inputActualSavings.value ||
      !inputStartDate.value ||
      !inputTargetIdentificationDate.value ||
      !inputActualIdentificationDate.value ||
      !inputApprovementStatus.value ||
      !inputResponsibleUserId.value
    ) {
      return;
    }
    const body = {
      name: inputName.value,
      reasonsForStatus: inputReasonsForStatus.value,
      actualSavingsVerifications: inputActualSavingsVerifications.value,
      actualSavings: inputActualSavings.value,
      startDate: inputStartDate.value,
      targetIdentificationDate: inputTargetIdentificationDate.value,
      actualIdentificationDate: inputActualIdentificationDate.value,
      approvementStatus: inputApprovementStatus.value,
      responsibleUserId: inputResponsibleUserId.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputName.value,
    inputReasonsForStatus.value,
    inputActualSavingsVerifications.value,
    inputActualSavings.value,
    inputStartDate.value,
    inputTargetIdentificationDate.value,
    inputActualIdentificationDate.value,
    inputApprovementStatus.value,
    inputResponsibleUserId.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine
          label={t("reasonsForStatus")}
          invalidMsg={inputReasonsForStatus.invalidMsg}
        >
          <CInputTextarea
            {...inputReasonsForStatus}
            placeholder={t("reasonsForStatus")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("actualSavingsVerifications")}
          invalidMsg={inputActualSavingsVerifications.invalidMsg}
        >
          <CInputString
            {...inputActualSavingsVerifications}
            placeholder={t("actualSavingsVerifications")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("actualSavings")}
          invalidMsg={inputActualSavings.invalidMsg}
        >
          <CInputString
            {...inputActualSavings}
            placeholder={t("actualSavings")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("startDate")}
          invalidMsg={inputStartDate.invalidMsg}
        >
          <CInputDate
            {...inputStartDate}
            placeholder={t("startDate")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("targetIdentificationDate")}
          invalidMsg={inputTargetIdentificationDate.invalidMsg}
        >
          <CInputDate
            {...inputTargetIdentificationDate}
            placeholder={t("targetIdentificationDate")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("actualIdentificationDate")}
          invalidMsg={inputActualIdentificationDate.invalidMsg}
        >
          <CInputDate
            {...inputActualIdentificationDate}
            placeholder={t("actualIdentificationDate")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("responsibleUser")}
          invalidMsg={inputResponsibleUserId.invalidMsg}
        >
          <CComboboxUser {...inputResponsibleUserId} required />
        </CFormLine>

        <CFormLine
          label={t("approvementStatus")}
          invalidMsg={inputApprovementStatus.invalidMsg}
        >
          <CComboboxDocumentApprovementStatus
            {...inputApprovementStatus}
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
