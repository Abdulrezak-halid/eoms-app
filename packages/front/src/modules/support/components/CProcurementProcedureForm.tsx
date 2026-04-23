import { useCallback } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectSeu } from "@m/base/components/CMultiSelectSeu";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoProcurementProcedureRequest,
  IDtoProcurementProcedureResponse,
} from "../interfaces/IDtoProcurementProcedure";

export function CProcurementProcedureForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoProcurementProcedureResponse;
  onSubmit: (data: IDtoProcurementProcedureRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputEquipmentSpecifications = useInput(
    initialData?.equipmentSpecifications,
  );
  const inputServiceSpecifications = useInput(
    initialData?.serviceSpecifications,
  );
  const inputNextReviewAt = useInput(initialData?.nextReviewAt);
  const inputSeuId = useInput(initialData?.seu?.id ? [initialData.seu.id] : []);

  const invalid = useInputInvalid(
    inputEquipmentSpecifications,
    inputServiceSpecifications,
    inputNextReviewAt,
    inputSeuId,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputEquipmentSpecifications.value ||
      !inputServiceSpecifications.value ||
      !inputNextReviewAt.value ||
      !inputSeuId.value
    ) {
      return;
    }

    const body = {
      equipmentSpecifications: inputEquipmentSpecifications.value,
      serviceSpecifications: inputServiceSpecifications.value,
      nextReviewAt: inputNextReviewAt.value,
      seuId: inputSeuId.value[0],
    };

    await onSubmit(body);
  }, [
    invalid,
    inputEquipmentSpecifications.value,
    inputServiceSpecifications.value,
    inputNextReviewAt.value,
    inputSeuId.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("equipmentSpecifications")}
          invalidMsg={inputEquipmentSpecifications.invalidMsg}
        >
          <CInputString
            {...inputEquipmentSpecifications}
            placeholder={t("equipmentSpecifications")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("serviceSpecifications")}
          invalidMsg={inputServiceSpecifications.invalidMsg}
        >
          <CInputTextarea
            {...inputServiceSpecifications}
            placeholder={t("serviceSpecifications")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("nextReviewAt")}
          invalidMsg={inputNextReviewAt.invalidMsg}
        >
          <CInputDate
            {...inputNextReviewAt}
            placeholder={t("nextReviewAt")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("significantEnergyUsers")}
          invalidMsg={inputSeuId.invalidMsg}
        >
          <CMultiSelectSeu {...inputSeuId} required></CMultiSelectSeu>
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
