import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { CComboboxSeu } from "@m/measurement/components/CComboboxSeu";

import { IDtoPlanRequest, IDtoPlanResponse } from "../interfaces/IDtoPlan";

export function CPlansForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoPlanResponse;
  onSubmit: (data: IDtoPlanRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputSeuId = useInput(initialData?.seu.id);
  const inputName = useInput(initialData?.name);
  const inputResponsibleUserId = useInput(initialData?.responsibleUser.id);
  const inputScheduleDate = useInput(initialData?.scheduleDate);

  const invalid = useInputInvalid(
    inputSeuId,
    inputName,
    inputResponsibleUserId,
    inputScheduleDate,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputSeuId.value ||
      !inputName.value ||
      !inputResponsibleUserId.value ||
      !inputScheduleDate.value
    ) {
      return;
    }

    const body = {
      seuId: inputSeuId.value,
      name: inputName.value,
      responsibleUserId: inputResponsibleUserId.value,
      scheduleDate: inputScheduleDate.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputSeuId.value,
    inputName.value,
    inputResponsibleUserId.value,
    inputScheduleDate.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("significantEnergyUsers")}
          invalidMsg={inputSeuId.invalidMsg}
        >
          <CComboboxSeu {...inputSeuId} required />
        </CFormLine>

        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine
          label={t("responsibleUser")}
          invalidMsg={inputResponsibleUserId.invalidMsg}
        >
          <CComboboxUser
            {...inputResponsibleUserId}
            placeholder={t("responsibleUser")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("scheduleDate")}
          invalidMsg={inputScheduleDate.invalidMsg}
        >
          <CInputDate
            {...inputScheduleDate}
            placeholder={t("scheduleDate")}
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
