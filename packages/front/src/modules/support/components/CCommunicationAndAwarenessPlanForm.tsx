import { useCallback } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectUser } from "@m/base/components/CMultiSelectUser";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputMultiString } from "@m/core/components/CInputMultiString";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoCommunicationAndAwarenessPlanRequest,
  IDtoCommunicationAndAwarenessPlanResponse,
} from "../interfaces/IDtoCommunicationAndAwarenessPlan";
import { CComboboxPlanType } from "./CComboboxPlanType";

export function CCommunicationAndAwarenessPlanForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoCommunicationAndAwarenessPlanResponse;
  onSubmit: (data: IDtoCommunicationAndAwarenessPlanRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputAction = useInput(initialData?.action);
  const inputInformation = useInput(initialData?.information);
  const inputReleasedAt = useInput(initialData?.releasedAt);
  const inputType = useInput(initialData?.type);
  const inputReleaseLocations = useInput(initialData?.releaseLocations);

  const inputFeedback = useInput(initialData?.feedback);
  const inputTargetUserIds = useInput(
    initialData?.targetUsers.map((d) => d.id),
  );

  const invalid = useInputInvalid(
    inputAction,
    inputInformation,
    inputReleasedAt,
    inputType,
    inputReleaseLocations,
    inputFeedback,
    inputTargetUserIds,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputAction.value ||
      !inputInformation.value ||
      !inputReleasedAt.value ||
      !inputType.value ||
      !inputReleaseLocations.value ||
      !inputFeedback.value ||
      !inputTargetUserIds.value
    ) {
      return;
    }

    const body = {
      action: inputAction.value,
      information: inputInformation.value,
      releasedAt: inputReleasedAt.value,
      type: inputType.value,
      releaseLocations: inputReleaseLocations.value,
      feedback: inputFeedback.value,
      targetUserIds: inputTargetUserIds.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputAction.value,
    inputInformation.value,
    inputReleasedAt.value,
    inputType.value,
    inputReleaseLocations.value,
    inputFeedback.value,
    inputTargetUserIds.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("action")} invalidMsg={inputAction.invalidMsg}>
          <CInputString {...inputAction} placeholder={t("action")} required />
        </CFormLine>

        <CFormLine
          label={t("information")}
          invalidMsg={inputInformation.invalidMsg}
        >
          <CInputString
            {...inputInformation}
            placeholder={t("information")}
            required
          />
        </CFormLine>

        <CFormLine label={t("feedback")} invalidMsg={inputFeedback.invalidMsg}>
          <CInputTextarea
            {...inputFeedback}
            placeholder={t("feedback")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("releasedAt")}
          invalidMsg={inputReleasedAt.invalidMsg}
        >
          <CInputDate
            {...inputReleasedAt}
            placeholder={t("releasedAt")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("targetUsers")}
          invalidMsg={inputTargetUserIds.invalidMsg}
        >
          <CMultiSelectUser {...inputTargetUserIds} required />
        </CFormLine>

        <CFormLine label={t("type")} invalidMsg={inputType.invalidMsg}>
          <CComboboxPlanType {...inputType} required />
        </CFormLine>

        <CFormLine
          label={t("releaseLocations")}
          invalidMsg={inputReleaseLocations.invalidMsg}
        >
          <CInputMultiString
            {...inputReleaseLocations}
            placeholder={t("releaseLocations")}
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
