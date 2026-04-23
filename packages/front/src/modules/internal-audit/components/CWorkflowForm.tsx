import { useCallback, useMemo } from "react";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoWorkflowRequest,
  IDtoWorkflowResponse,
} from "../interfaces/IDtoWorkflow";
import { CMultiSelectNonconformity } from "./CMultiSelectNonconformity";

export function CWorkflowForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoWorkflowResponse;
  onSubmit: (data: IDtoWorkflowRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const initialNonconfirityIds = useMemo(
    () => initialData?.nonconformities.map((d) => d.id),
    [initialData],
  );

  const inputPart = useInput(initialData?.part);
  const inputReviewerUserId = useInput(initialData?.reviewerUser.id);
  const inputHighLevelSubject = useInput(initialData?.highLevelSubject);
  const inputSubject = useInput(initialData?.subject);
  const inputQuestions = useInput(initialData?.questions);
  const inputNecessaries = useInput(initialData?.necessaries);
  const inputNecessaryProof = useInput(initialData?.necessaryProof);
  const inputObtainedProof = useInput(initialData?.obtainedProof);
  const inputCorrectiveActionDecisions = useInput(
    initialData?.correctiveActionDecisions,
  );
  const inputComments = useInput(initialData?.comments);
  const inputNonconformityIds = useInput(initialNonconfirityIds);

  const invalid = useInputInvalid(
    inputPart,
    inputReviewerUserId,
    inputHighLevelSubject,
    inputSubject,
    inputQuestions,
    inputNecessaries,
    inputNecessaryProof,
    inputObtainedProof,
    inputCorrectiveActionDecisions,
    inputComments,
    inputNonconformityIds,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputPart.value ||
      !inputReviewerUserId.value ||
      !inputHighLevelSubject.value ||
      !inputSubject.value ||
      !inputQuestions.value ||
      !inputNecessaries.value ||
      !inputNecessaryProof.value ||
      !inputObtainedProof.value ||
      !inputCorrectiveActionDecisions.value ||
      !inputComments.value ||
      !inputNonconformityIds.value
    ) {
      return;
    }

    await onSubmit({
      part: inputPart.value,
      reviewerUserId: inputReviewerUserId.value,
      highLevelSubject: inputHighLevelSubject.value,
      subject: inputSubject.value,
      questions: inputQuestions.value,
      necessaries: inputNecessaries.value,
      necessaryProof: inputNecessaryProof.value,
      obtainedProof: inputObtainedProof.value,
      correctiveActionDecisions: inputCorrectiveActionDecisions.value,
      comments: inputComments.value,
      nonconformityIds: inputNonconformityIds.value,
    });
  }, [
    invalid,
    inputPart.value,
    inputReviewerUserId.value,
    inputHighLevelSubject.value,
    inputSubject.value,
    inputQuestions.value,
    inputNecessaries.value,
    inputNecessaryProof.value,
    inputObtainedProof.value,
    inputCorrectiveActionDecisions.value,
    inputComments.value,
    inputNonconformityIds.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("part")} invalidMsg={inputPart.invalidMsg}>
          <CInputString {...inputPart} placeholder={t("part")} required />
        </CFormLine>

        <CFormLine
          label={t("highLevelSubject")}
          invalidMsg={inputHighLevelSubject.invalidMsg}
        >
          <CInputString
            {...inputHighLevelSubject}
            placeholder={t("highLevelSubject")}
            required
          />
        </CFormLine>

        <CFormLine label={t("subject")} invalidMsg={inputSubject.invalidMsg}>
          <CInputString {...inputSubject} placeholder={t("subject")} required />
        </CFormLine>

        <CFormLine
          label={t("questions")}
          invalidMsg={inputQuestions.invalidMsg}
        >
          <CInputString
            {...inputQuestions}
            placeholder={t("questions")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("necessaries")}
          invalidMsg={inputNecessaries.invalidMsg}
        >
          <CInputString
            {...inputNecessaries}
            placeholder={t("necessaries")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("necessaryProof")}
          invalidMsg={inputNecessaryProof.invalidMsg}
        >
          <CInputString
            {...inputNecessaryProof}
            placeholder={t("necessaryProof")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("obtainedProof")}
          invalidMsg={inputObtainedProof.invalidMsg}
        >
          <CInputString
            {...inputObtainedProof}
            placeholder={t("obtainedProof")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("correctiveActionDecisions")}
          invalidMsg={inputCorrectiveActionDecisions.invalidMsg}
        >
          <CInputTextarea
            {...inputCorrectiveActionDecisions}
            placeholder={t("correctiveActionDecisions")}
            required
          />
        </CFormLine>

        <CFormLine label={t("comments")} invalidMsg={inputComments.invalidMsg}>
          <CInputTextarea
            {...inputComments}
            placeholder={t("comments")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("reviewerUser")}
          invalidMsg={inputReviewerUserId.invalidMsg}
        >
          <CComboboxUser
            {...inputReviewerUserId}
            placeholder={t("reviewerUser")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("nonconformities")}
          invalidMsg={inputNonconformityIds.invalidMsg}
        >
          <CMultiSelectNonconformity
            {...inputNonconformityIds}
            placeholder={t("nonconformities")}
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
