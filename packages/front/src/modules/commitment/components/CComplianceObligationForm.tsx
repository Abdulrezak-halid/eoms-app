import { useCallback, useState } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxPeriod } from "@m/base/components/CComboboxPeriod";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoComplianceObligationRequest,
  IDtoComplianceObligationResponse,
} from "../interfaces/IDtoComplianceObligation";

export function CComplianceObligationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoComplianceObligationResponse;
  onSubmit: (data: IDtoComplianceObligationRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const [isLegalActive, setIsLegalActive] = useState(
    Boolean(initialData?.isLegalActive),
  );
  const inputComplianceObligation = useInput(initialData?.complianceObligation);
  const inputOfficialNewspaperNo = useInput(initialData?.officialNewspaperNo);
  const inputOfficialNewspaperPublicationDate = useInput(
    initialData?.officialNewspaperPublicationDate,
  );
  const inputReviewDate = useInput(initialData?.reviewDate);

  const inputReviewPeriod = useInput(initialData?.reviewPeriod);
  const inputRevisionDate = useInput(initialData?.revisionDate);
  const inputRevisionNo = useInput(initialData?.revisionNo);

  const invalidForm = useInputInvalid(
    inputComplianceObligation,
    inputOfficialNewspaperNo,
    inputOfficialNewspaperPublicationDate,
    inputReviewDate,
    inputReviewPeriod,
    inputRevisionDate,
    inputRevisionNo,
  );
  const invalid = invalidForm;

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputComplianceObligation.value ||
      !inputOfficialNewspaperNo.value ||
      !inputOfficialNewspaperPublicationDate.value ||
      !inputReviewDate.value ||
      !inputReviewPeriod.value ||
      !inputRevisionDate.value ||
      !inputRevisionNo.value
    ) {
      return;
    }

    const body = {
      complianceObligation: inputComplianceObligation.value,
      officialNewspaperNo: inputOfficialNewspaperNo.value,
      officialNewspaperPublicationDate:
        inputOfficialNewspaperPublicationDate.value,
      reviewDate: inputReviewDate.value,
      reviewPeriod: inputReviewPeriod.value,
      revisionDate: inputRevisionDate.value,
      revisionNo: inputRevisionNo.value,
      isLegalActive: isLegalActive,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputComplianceObligation.value,
    inputOfficialNewspaperNo.value,
    inputOfficialNewspaperPublicationDate.value,
    inputReviewDate.value,
    inputReviewPeriod.value,
    inputRevisionDate.value,
    inputRevisionNo.value,
    isLegalActive,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("complianceObligation")}
          invalidMsg={inputComplianceObligation.invalidMsg}
        >
          <CInputString
            {...inputComplianceObligation}
            placeholder={t("complianceObligation")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("officialNewspaperNo")}
          invalidMsg={inputOfficialNewspaperNo.invalidMsg}
        >
          <CInputString
            {...inputOfficialNewspaperNo}
            placeholder={t("officialNewspaperNo")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("officialNewspaperPublicationDate")}
          invalidMsg={inputOfficialNewspaperPublicationDate.invalidMsg}
        >
          <CInputDate
            {...inputOfficialNewspaperPublicationDate}
            placeholder={t("officialNewspaperPublicationDate")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("reviewPeriod")}
          invalidMsg={inputReviewPeriod.invalidMsg}
        >
          <CComboboxPeriod {...inputReviewPeriod} required />
        </CFormLine>

        <CFormLine
          label={t("reviewDate")}
          invalidMsg={inputReviewDate.invalidMsg}
        >
          <CInputDate
            {...inputReviewDate}
            placeholder={t("reviewDate")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("revisionNo")}
          invalidMsg={inputRevisionNo.invalidMsg}
        >
          <CInputString
            {...inputRevisionNo}
            placeholder={t("revisionNo")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("revisionDate")}
          invalidMsg={inputRevisionDate.invalidMsg}
        >
          <CInputDate
            {...inputRevisionDate}
            placeholder={t("revisionDate")}
            required
          />
        </CFormLine>

        <CFormLine label={t("isLegalActive")}>
          <CCheckbox selected={isLegalActive} onChange={setIsLegalActive} />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
