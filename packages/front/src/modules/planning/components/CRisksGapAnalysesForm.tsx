import { useCallback, useState } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoRiskGapAnalysesRequest,
  IDtoRiskGapAnalysesResponse,
} from "../interfaces/IDtoRiskGapAnalyses";

export function CRisksGapAnalysesForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoRiskGapAnalysesResponse;
  onSubmit: (data: IDtoRiskGapAnalysesRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputQuestion = useInput(initialData?.question);
  const inputHeadings = useInput(initialData?.headings);
  const inputScore = useInput(initialData?.score);
  const inputEvidence = useInput(initialData?.evidence);
  const inputConsideration = useInput(initialData?.consideration);
  const inputIsActionRequired = useInput(initialData?.isActionRequired);
  const [boolState, setBoolState] = useState(
    Boolean(initialData?.isActionRequired),
  );

  const invalid = useInputInvalid(
    inputQuestion,
    inputHeadings,
    inputScore,
    inputEvidence,
    inputConsideration,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputQuestion.value ||
      !inputHeadings.value ||
      !inputScore.value ||
      !inputEvidence.value ||
      !inputConsideration.value
    ) {
      return;
    }

    const body = {
      question: inputQuestion.value,
      headings: inputHeadings.value,
      score: inputScore.value,
      evidence: inputEvidence.value,
      consideration: inputConsideration.value,
      isActionRequired: boolState,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputQuestion.value,
    inputHeadings.value,
    inputScore.value,
    inputEvidence.value,
    inputConsideration.value,
    boolState,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("question")} invalidMsg={inputQuestion.invalidMsg}>
          <CInputString
            {...inputQuestion}
            placeholder={t("question")}
            required
          />
        </CFormLine>

        <CFormLine label={t("headings")} invalidMsg={inputHeadings.invalidMsg}>
          <CInputString
            {...inputHeadings}
            placeholder={t("headings")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("score")}
          invalidMsg={inputScore.invalidMsg}
          info={t("msgScoreInfo")}
        >
          <CInputNumber
            {...inputScore}
            placeholder={t("score")}
            min={0}
            max={5}
            float
            required
          />
        </CFormLine>

        <CFormLine label={t("evidence")} invalidMsg={inputEvidence.invalidMsg}>
          <CInputTextarea
            {...inputEvidence}
            placeholder={t("evidence")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("consideration")}
          invalidMsg={inputConsideration.invalidMsg}
        >
          <CInputTextarea
            {...inputConsideration}
            placeholder={t("consideration")}
            required
          />
        </CFormLine>
        <CFormLine
          label={t("actionRequired")}
          invalidMsg={inputIsActionRequired.invalidMsg}
        >
          <CCheckbox
            {...inputIsActionRequired}
            selected={boolState}
            onChange={setBoolState}
            disabled={false}
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
