import { MAX_API_NUMBER_VALUE } from "common";
import { useCallback, useState } from "react";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoRiskForceFieldAnalysisRequest,
  IDtoRiskForceFieldAnalysisResponse,
} from "../interfaces/IDtoRiskForceFieldAnalysis";

export function CRiskForceFieldAnalysisForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoRiskForceFieldAnalysisResponse;
  onSubmit: (data: IDtoRiskForceFieldAnalysisRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const [isSucceed, setIsSucceed] = useState(Boolean(initialData?.isSucceed));

  const [isFollowUpRequired, setIsFollowUpRequired] = useState(
    Boolean(initialData?.isFollowUpRequired),
  );

  const [isActionRequired, setIsActionRequired] = useState(
    Boolean(initialData?.isActionRequired),
  );

  const inputParameter = useInput(initialData?.parameter);
  const inputScore = useInput(initialData?.score);
  const inputResponsibleUserId = useInput(initialData?.responsibleUser.id);
  const inputSolutions = useInput(initialData?.solutions);
  const inputCompletedAt = useInput(initialData?.completedAt);
  const inputEstimatedCompletionDate = useInput(
    initialData?.estimatedCompletionDate,
  );

  const invalid = useInputInvalid(
    inputParameter,
    inputScore,
    inputResponsibleUserId,
    inputSolutions,
    inputCompletedAt,
    inputEstimatedCompletionDate,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputParameter.value ||
      !inputScore.value ||
      !inputResponsibleUserId.value ||
      !inputSolutions.value ||
      !inputCompletedAt.value ||
      !inputEstimatedCompletionDate.value
    ) {
      return;
    }

    const body = {
      parameter: inputParameter.value,
      score: inputScore.value,
      responsibleUserId: inputResponsibleUserId.value,
      solutions: inputSolutions.value,
      completedAt: inputCompletedAt.value,
      estimatedCompletionDate: inputEstimatedCompletionDate.value,
      isSucceed: isSucceed,
      isFollowUpRequired: isFollowUpRequired,
      isActionRequired: isActionRequired,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputParameter.value,
    inputScore.value,
    inputResponsibleUserId,
    inputSolutions.value,
    inputCompletedAt.value,
    inputEstimatedCompletionDate.value,
    isSucceed,
    isFollowUpRequired,
    isActionRequired,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
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

        <CFormLine label={t("score")} invalidMsg={inputScore.invalidMsg}>
          <CInputNumber
            {...inputScore}
            placeholder={t("score")}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            float
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
          label={t("estimatedCompletionDate")}
          invalidMsg={inputEstimatedCompletionDate.invalidMsg}
        >
          <CInputDate
            {...inputEstimatedCompletionDate}
            placeholder={t("estimatedCompletionDate")}
            required
          />
        </CFormLine>

        <CFormLine label={t("isSucceed")}>
          <CCheckbox selected={isSucceed} onChange={setIsSucceed} />
        </CFormLine>

        <CFormLine label={t("isFollowUpRequired")}>
          <CCheckbox
            selected={isFollowUpRequired}
            onChange={setIsFollowUpRequired}
          />
        </CFormLine>

        <CFormLine label={t("isActionRequired")}>
          <CCheckbox
            selected={isActionRequired}
            onChange={setIsActionRequired}
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
