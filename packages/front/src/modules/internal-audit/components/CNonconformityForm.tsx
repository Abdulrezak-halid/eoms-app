import { MAX_API_NUMBER_VALUE } from "common";
import { useCallback, useMemo, useState } from "react";

import { CComboboxUser } from "@m/base/components/CComboboxUser";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoNonconformityRequest,
  IDtoNonconformityResponse,
} from "../interfaces/IDtoNonconformity";

export function CNonconformityForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoNonconformityResponse;
  onSubmit: (data: IDtoNonconformityRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const radioList = useMemo(
    () => [
      {
        label: t("open"),
        value: true,
      },
      {
        label: t("close"),
        value: false,
      },
    ],
    [t],
  );

  const [isCorrectiveActionOpen, setIsCorrectiveActionOpen] = useState(
    Boolean(initialData?.isCorrectiveActionOpen),
  );
  const inputDefinition = useInput(initialData?.definition);
  const inputResponsibleUserId = useInput(initialData?.responsibleUser.id);
  const inputReviewerUserId = useInput(initialData?.reviewerUser.id);
  const inputNo = useInput(initialData?.no);
  const inputIdentifiedAt = useInput(initialData?.identifiedAt);
  const inputRequirement = useInput(initialData?.requirement);
  const inputSource = useInput(initialData?.source);
  const inputPotentialResult = useInput(initialData?.potentialResult);
  const inputRootCause = useInput(initialData?.rootCause);
  const inputAction = useInput(initialData?.action);
  const inputTargetIdentificationDate = useInput(
    initialData?.targetIdentificationDate,
  );
  const inputActualIdentificationDate = useInput(
    initialData?.actualIdentificationDate,
  );

  const inputReviewerFeedback = useInput(initialData?.reviewerFeedback);

  const invalid = useInputInvalid(
    inputDefinition,
    inputResponsibleUserId,
    inputReviewerUserId,
    inputNo,
    inputIdentifiedAt,
    inputRequirement,
    inputSource,
    inputPotentialResult,
    inputRootCause,
    inputAction,
    inputTargetIdentificationDate,
    inputActualIdentificationDate,
    inputReviewerFeedback,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputDefinition.value ||
      !inputResponsibleUserId.value ||
      !inputReviewerUserId.value ||
      !inputNo.value ||
      !inputIdentifiedAt.value ||
      !inputRequirement.value ||
      !inputSource.value ||
      !inputPotentialResult.value ||
      !inputRootCause.value ||
      !inputAction.value ||
      !inputTargetIdentificationDate.value ||
      !inputActualIdentificationDate.value ||
      !inputReviewerFeedback.value
    ) {
      return;
    }

    await onSubmit({
      definition: inputDefinition.value,
      responsibleUserId: inputResponsibleUserId.value,
      reviewerUserId: inputReviewerUserId.value,
      no: inputNo.value,
      identifiedAt: inputIdentifiedAt.value,
      requirement: inputRequirement.value,
      source: inputSource.value,
      potentialResult: inputPotentialResult.value,
      rootCause: inputRootCause.value,
      action: inputAction.value,
      targetIdentificationDate: inputTargetIdentificationDate.value,
      actualIdentificationDate: inputActualIdentificationDate.value,
      isCorrectiveActionOpen: isCorrectiveActionOpen,
      reviewerFeedback: inputReviewerFeedback.value,
    });
  }, [
    invalid,
    inputDefinition.value,
    inputResponsibleUserId.value,
    inputReviewerUserId.value,
    inputNo.value,
    inputIdentifiedAt.value,
    inputRequirement.value,
    inputSource.value,
    inputPotentialResult.value,
    inputRootCause.value,
    inputAction.value,
    inputTargetIdentificationDate.value,
    inputActualIdentificationDate.value,
    isCorrectiveActionOpen,
    inputReviewerFeedback.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("definition")}
          invalidMsg={inputDefinition.invalidMsg}
        >
          <CInputString
            {...inputDefinition}
            placeholder={t("definition")}
            required
          />
        </CFormLine>

        <CFormLine label={t("numberShort")} invalidMsg={inputNo.invalidMsg}>
          <CInputNumber
            {...inputNo}
            min={0}
            max={MAX_API_NUMBER_VALUE}
            placeholder={t("numberShort")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("requirement")}
          invalidMsg={inputRequirement.invalidMsg}
        >
          <CInputString
            {...inputRequirement}
            placeholder={t("requirement")}
            required
          />
        </CFormLine>

        <CFormLine label={t("source")} invalidMsg={inputSource.invalidMsg}>
          <CInputString {...inputSource} placeholder={t("source")} required />
        </CFormLine>

        <CFormLine
          label={t("potentialResult")}
          invalidMsg={inputPotentialResult.invalidMsg}
        >
          <CInputString
            {...inputPotentialResult}
            placeholder={t("potentialResult")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("rootCause")}
          invalidMsg={inputRootCause.invalidMsg}
        >
          <CInputString
            {...inputRootCause}
            placeholder={t("rootCause")}
            required
          />
        </CFormLine>

        <CFormLine label={t("action")} invalidMsg={inputAction.invalidMsg}>
          <CInputString {...inputAction} placeholder={t("action")} required />
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
          label={t("identifiedAt")}
          invalidMsg={inputIdentifiedAt.invalidMsg}
        >
          <CInputDate
            {...inputIdentifiedAt}
            placeholder={t("identifiedAt")}
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
          <CComboboxUser
            {...inputResponsibleUserId}
            placeholder={t("responsibleUser")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("reviewerFeedback")}
          invalidMsg={inputReviewerFeedback.invalidMsg}
        >
          <CInputTextarea
            {...inputReviewerFeedback}
            placeholder={t("reviewerFeedback")}
            required
          />
        </CFormLine>

        <CFormLine label={t("statusOfCorrectiveAction")}>
          <CRadioGroup
            list={radioList}
            value={isCorrectiveActionOpen}
            onChange={setIsCorrectiveActionOpen}
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
