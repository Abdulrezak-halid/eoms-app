import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { CComboboxSeu } from "@m/measurement/components/CComboboxSeu";

import {
  IDtoEnpiRequest,
  IDtoEnpiResponse,
} from "../interfaces/IDtoEnergyPerformanceIndicators";

export function CEnpiForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoEnpiResponse;
  onSubmit: (data: IDtoEnpiRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputSeuId = useInput(initialData?.seu.id);
  const inputEquipment = useInput(initialData?.equipment);
  const inputTargetedDate = useInput(initialData?.targetedDate);
  const inputTargetedImprovement = useInput(initialData?.targetedImprovement);

  const invalid = useInputInvalid(
    inputSeuId,
    inputEquipment,
    inputTargetedDate,
    inputTargetedImprovement,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputSeuId.value ||
      !inputEquipment.value ||
      !inputTargetedDate.value ||
      !inputTargetedImprovement.value
    ) {
      return;
    }

    const body = {
      seuId: inputSeuId.value,
      equipment: inputEquipment.value,
      targetedDate: inputTargetedDate.value,
      targetedImprovement: inputTargetedImprovement.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputSeuId.value,
    inputEquipment.value,
    inputTargetedDate.value,
    inputTargetedImprovement,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("equipment")}
          invalidMsg={inputEquipment.invalidMsg}
        >
          <CInputString
            {...inputEquipment}
            placeholder={t("equipment")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("targetedImprovement")}
          invalidMsg={inputTargetedImprovement.invalidMsg}
        >
          <CInputNumber
            {...inputTargetedImprovement}
            placeholder={t("targetedImprovement")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("targetedDate")}
          invalidMsg={inputTargetedDate.invalidMsg}
        >
          <CInputDate
            {...inputTargetedDate}
            placeholder={t("targetedDate")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("significantEnergyUsers")}
          invalidMsg={inputSeuId.invalidMsg}
        >
          <CComboboxSeu {...inputSeuId} required />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
