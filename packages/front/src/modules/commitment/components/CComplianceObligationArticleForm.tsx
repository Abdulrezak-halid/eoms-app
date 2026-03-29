import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxPeriod } from "@m/base/components/CComboboxPeriod";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoComplianceObligationArticleRequest,
  IDtoComplianceObligationArticleResponse,
} from "../interfaces/IDtoComplianceObligation";

export function CComplianceObligationArticleForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoComplianceObligationArticleResponse;
  onSubmit: (data: IDtoComplianceObligationArticleRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputConformityAssessment = useInput(initialData?.conformityAssessment);
  const inputConformityAssessmentPeriod = useInput(
    initialData?.conformityAssessmentPeriod,
  );
  const inputCurrentApplication = useInput(initialData?.currentApplication);
  const inputLastConformityAssessment = useInput(
    initialData?.lastConformityAssessment,
  );
  const inputRelatedArticleNo = useInput(initialData?.relatedArticleNo);
  const inputDescription = useInput(initialData?.description || "");

  const invalid = useInputInvalid(
    inputConformityAssessment,
    inputConformityAssessmentPeriod,
    inputCurrentApplication,
    inputLastConformityAssessment,
    inputRelatedArticleNo,
    inputDescription,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputConformityAssessment.value ||
      !inputConformityAssessmentPeriod.value ||
      !inputCurrentApplication.value ||
      !inputLastConformityAssessment.value ||
      !inputRelatedArticleNo.value ||
      !inputDescription.value
    ) {
      return;
    }

    const body = {
      conformityAssessment: inputConformityAssessment.value,
      conformityAssessmentPeriod: inputConformityAssessmentPeriod.value,
      currentApplication: inputCurrentApplication.value,
      lastConformityAssessment: inputLastConformityAssessment.value,
      relatedArticleNo: inputRelatedArticleNo.value,
      description: inputDescription.value || null,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputConformityAssessment.value,
    inputConformityAssessmentPeriod.value,
    inputCurrentApplication.value,
    inputLastConformityAssessment.value,
    inputRelatedArticleNo.value,
    inputDescription.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("conformityAssessment")}
          invalidMsg={inputConformityAssessment.invalidMsg}
        >
          <CInputString
            {...inputConformityAssessment}
            placeholder={t("conformityAssessment")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("conformityAssessmentPeriod")}
          invalidMsg={inputConformityAssessmentPeriod.invalidMsg}
        >
          <CComboboxPeriod {...inputConformityAssessmentPeriod} required />
        </CFormLine>

        <CFormLine
          label={t("currentApplication")}
          invalidMsg={inputCurrentApplication.invalidMsg}
        >
          <CInputString
            {...inputCurrentApplication}
            placeholder={t("currentApplication")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("lastConformityAssessment")}
          invalidMsg={inputLastConformityAssessment.invalidMsg}
        >
          <CInputDate
            {...inputLastConformityAssessment}
            placeholder={t("lastConformityAssessment")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("relatedArticleNo")}
          invalidMsg={inputRelatedArticleNo.invalidMsg}
        >
          <CInputString
            {...inputRelatedArticleNo}
            placeholder={t("relatedArticleNo")}
            required
          />
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
