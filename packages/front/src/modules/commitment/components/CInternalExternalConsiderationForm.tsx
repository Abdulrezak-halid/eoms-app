import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectDepartment } from "@m/base/components/CMultiSelectDepartment";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoInternalExternalConsiderationItemResponse,
  IDtoInternalExternalConsiderationRequest,
} from "../interfaces/IDtoInternalExternalConsideration";

export function CInternalExternalConsiderationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoInternalExternalConsiderationItemResponse;
  onSubmit: (data: IDtoInternalExternalConsiderationRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputSpecific = useInput(initialData?.specific);
  const inputImpactPoint = useInput(initialData?.impactPoint);
  const inputEvaluationMethod = useInput(initialData?.evaluationMethod);
  const inputRevisionDate = useInput(initialData?.revisionDate);
  const inputDepartmentIds = useInput(
    initialData?.departments.map((d) => d.id),
  );

  const invalid = useInputInvalid(
    inputSpecific,
    inputImpactPoint,
    inputEvaluationMethod,
    inputRevisionDate,
    inputDepartmentIds,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputSpecific.value ||
      !inputImpactPoint.value ||
      !inputEvaluationMethod.value ||
      !inputRevisionDate.value ||
      !inputDepartmentIds.value
    ) {
      return;
    }

    const body = {
      specific: inputSpecific.value,
      impactPoint: inputImpactPoint.value,
      evaluationMethod: inputEvaluationMethod.value,
      revisionDate: inputRevisionDate.value,
      departmentIds: inputDepartmentIds.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputSpecific.value,
    inputImpactPoint.value,
    inputEvaluationMethod.value,
    inputRevisionDate.value,
    inputDepartmentIds.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("specific")} invalidMsg={inputSpecific.invalidMsg}>
          <CInputString
            {...inputSpecific}
            placeholder={t("specific")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("impactPoint")}
          invalidMsg={inputImpactPoint.invalidMsg}
        >
          <CInputString
            {...inputImpactPoint}
            placeholder={t("impactPoint")}
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

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
