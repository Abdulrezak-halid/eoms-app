import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxPeriod } from "@m/base/components/CComboboxPeriod";
import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { CComboboxSeu } from "@m/measurement/components/CComboboxSeu";

import {
  IDtoMaintenanceActivityRequest,
  IDtoMaintenanceActivityResponse,
} from "../interfaces/IDtoMaintenanceActivity";

export function CMaintenanceActivityForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoMaintenanceActivityResponse;
  onSubmit: (data: IDtoMaintenanceActivityRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputSeuId = useInput(initialData?.seu.id);
  const inputTask = useInput(initialData?.task);
  const inputPeriod = useInput(initialData?.period);
  const inputLastMaintainedAt = useInput(initialData?.lastMaintainedAt);
  const inputResponsibleUserId = useInput(initialData?.responsibleUser.id);
  const inputNote = useInput(initialData?.note || "");

  const invalid = useInputInvalid(
    inputSeuId,
    inputTask,
    inputPeriod,
    inputLastMaintainedAt,
    inputResponsibleUserId,
    inputNote,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputSeuId.value ||
      !inputTask.value ||
      !inputPeriod.value ||
      !inputLastMaintainedAt.value ||
      !inputResponsibleUserId.value
    ) {
      return;
    }

    const body = {
      seuId: inputSeuId.value,
      task: inputTask.value,
      period: inputPeriod.value,
      lastMaintainedAt: inputLastMaintainedAt.value,
      responsibleUserId: inputResponsibleUserId.value,
      note: inputNote.value || null,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputSeuId.value,
    inputTask.value,
    inputPeriod.value,
    inputLastMaintainedAt.value,
    inputResponsibleUserId.value,
    inputNote.value,
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

        <CFormLine label={t("task")} invalidMsg={inputTask.invalidMsg}>
          <CInputString {...inputTask} placeholder={t("task")} required />
        </CFormLine>

        <CFormLine label={t("period")} invalidMsg={inputPeriod.invalidMsg}>
          <CComboboxPeriod
            {...inputPeriod}
            placeholder={t("period")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("lastMaintainedAt")}
          invalidMsg={inputLastMaintainedAt.invalidMsg}
        >
          <CInputDate
            {...inputLastMaintainedAt}
            placeholder={t("lastMaintainedAt")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("responsibleUser")}
          invalidMsg={inputResponsibleUserId.invalidMsg}
        >
          <CComboboxUser {...inputResponsibleUserId} required />
        </CFormLine>

        <CFormLine label={t("notes")} invalidMsg={inputNote.invalidMsg}>
          <CInputTextarea {...inputNote} placeholder={t("notes")} />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
