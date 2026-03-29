import { useCallback, useState } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectDepartment } from "@m/base/components/CMultiSelectDepartment";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoNeedAndExpectationRequest,
  IDtoNeedAndExpectationResponse,
} from "../interfaces/IDtoNeedAndExpectation";

export function CNeedAndExpectationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoNeedAndExpectationResponse;
  onSubmit: (data: IDtoNeedAndExpectationRequest) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [isIncludedInEnms, setIsIncludedInEnms] = useState(
    Boolean(initialData?.isIncludedInEnms),
  );
  const inputInterestedParty = useInput(initialData?.interestedParty);
  const inputInterestedPartyNeedsAndExpectations = useInput(
    initialData?.interestedPartyNeedsAndExpectations,
  );
  const inputEvaluationMethod = useInput(initialData?.evaluationMethod);
  const inputRevisionDate = useInput(initialData?.revisionDate);
  const inputDepartmentIds = useInput(
    initialData?.departments.map((d) => d.id),
  );

  const invalid = useInputInvalid(
    inputInterestedParty,
    inputInterestedPartyNeedsAndExpectations,
    inputEvaluationMethod,
    inputRevisionDate,
    inputDepartmentIds,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputInterestedParty.value ||
      !inputInterestedPartyNeedsAndExpectations.value ||
      !inputEvaluationMethod.value ||
      !inputRevisionDate.value ||
      !inputDepartmentIds.value
    ) {
      return;
    }

    const body = {
      interestedParty: inputInterestedParty.value,
      interestedPartyNeedsAndExpectations:
        inputInterestedPartyNeedsAndExpectations.value,
      evaluationMethod: inputEvaluationMethod.value,
      revisionDate: inputRevisionDate.value,
      departmentIds: inputDepartmentIds.value,
      isIncludedInEnms: isIncludedInEnms,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputInterestedParty.value,
    inputInterestedPartyNeedsAndExpectations.value,
    inputEvaluationMethod.value,
    inputRevisionDate.value,
    inputDepartmentIds.value,
    isIncludedInEnms,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine
          label={t("relevantParty")}
          invalidMsg={inputInterestedParty.invalidMsg}
        >
          <CInputString
            {...inputInterestedParty}
            placeholder={t("relevantParty")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("needsAndExpectations")}
          invalidMsg={inputInterestedPartyNeedsAndExpectations.invalidMsg}
        >
          <CInputTextarea
            {...inputInterestedPartyNeedsAndExpectations}
            placeholder={t("needsAndExpectations")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("evaluationMethod")}
          invalidMsg={inputEvaluationMethod.invalidMsg}
        >
          <CInputString
            {...inputEvaluationMethod}
            placeholder={t("evaluationMethod")}
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

        <CFormLine
          label={t("departmentMulti")}
          invalidMsg={inputDepartmentIds.invalidMsg}
        >
          <CMultiSelectDepartment
            {...inputDepartmentIds}
            required
          ></CMultiSelectDepartment>
        </CFormLine>

        <CFormLine label={t("isIncludedInEnms")}>
          <CCheckbox
            selected={isIncludedInEnms}
            onChange={setIsIncludedInEnms}
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
