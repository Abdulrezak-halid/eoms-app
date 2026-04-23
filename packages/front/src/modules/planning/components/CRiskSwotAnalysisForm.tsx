import { useCallback, useState } from "react";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoRiskSwotAnalysisRequest,
  IDtoRiskSwotAnalysisResponse,
} from "../interfaces/IDtoRiskSwotAnalysis";

export function CRiskSwotAnalysisForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoRiskSwotAnalysisResponse;
  onSubmit: (data: IDtoRiskSwotAnalysisRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const [boolState, setBoolState] = useState(
    Boolean(initialData?.isActionRequired),
  );

  const inputType = useInput(initialData?.type);
  const inputDescription = useInput(initialData?.description || "");
  const inputSolutions = useInput(initialData?.solutions);
  const inputResponsibleUserId = useInput(initialData?.responsibleUser.id);
  const inputAnalysisCreatedAt = useInput(initialData?.analysisCreatedAt);
  const inputEstimatedCompletionDate = useInput(
    initialData?.estimatedCompletionDate,
  );
  const inputCompletedAt = useInput(initialData?.completedAt);

  const invalid = useInputInvalid(
    inputType,
    inputDescription,
    inputSolutions,
    inputResponsibleUserId,
    inputAnalysisCreatedAt,
    inputEstimatedCompletionDate,
    inputCompletedAt,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputType.value ||
      !inputSolutions.value ||
      !inputResponsibleUserId.value ||
      !inputAnalysisCreatedAt.value ||
      !inputEstimatedCompletionDate.value ||
      !inputCompletedAt.value
    ) {
      return;
    }

    const body = {
      type: inputType.value,
      description: inputDescription.value || null,
      solutions: inputSolutions.value,
      responsibleUserId: inputResponsibleUserId.value,
      analysisCreatedAt: inputAnalysisCreatedAt.value,
      estimatedCompletionDate: inputEstimatedCompletionDate.value,
      completedAt: inputCompletedAt.value,
      isActionRequired: boolState,
    };
    await onSubmit(body);
  }, [
    boolState,
    inputAnalysisCreatedAt.value,
    inputCompletedAt.value,
    inputDescription.value,
    inputEstimatedCompletionDate.value,
    inputResponsibleUserId.value,
    inputSolutions.value,
    inputType.value,
    invalid,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("type")} invalidMsg={inputType.invalidMsg}>
          <CInputString {...inputType} placeholder={t("type")} required />
        </CFormLine>
        <CFormLine
          label={t("solutions")}
          invalidMsg={inputSolutions.invalidMsg}
        >
          <CInputTextarea
            {...inputSolutions}
            placeholder={t("solutions")}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("createdAt")}
          invalidMsg={inputAnalysisCreatedAt.invalidMsg}
        >
          <CInputDate
            {...inputAnalysisCreatedAt}
            placeholder={t("createdAt")}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("estimatedCompletionDate")}
          invalidMsg={inputEstimatedCompletionDate.invalidMsg}
        >
          <CInputDate
            {...inputEstimatedCompletionDate}
            placeholder={t("estimatedCompletionDate")}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("completedAt")}
          invalidMsg={inputCompletedAt.invalidMsg}
        >
          <CInputDate
            {...inputCompletedAt}
            placeholder={t("completedAt")}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("responsibleUser")}
          invalidMsg={inputResponsibleUserId.invalidMsg}
        >
          <CComboboxUser {...inputResponsibleUserId} required />
        </CFormLine>
        <CFormLine label={t("isActionRequired")}>
          <CCheckbox selected={boolState} onChange={setBoolState} />
        </CFormLine>
        <CFormLine
          label={t("description")}
          invalidMsg={inputDescription.invalidMsg}
        >
          <CInputTextarea
            {...inputDescription}
            placeholder={t("description")}
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
