import { useCallback } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoDepartmentRequest,
  IDtoDepartmentResponse,
} from "../interfaces/IDtoDepartment";

export function CDepartmentForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoDepartmentResponse;
  onSubmit: (data: IDtoDepartmentRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputDescription = useInput(initialData?.description || "");

  const invalid = useInputInvalid(inputName, inputDescription);

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputName.value) {
      return;
    }

    const body = {
      name: inputName.value,
      description: inputDescription.value || null,
    };

    await onSubmit(body);
  }, [invalid, inputName.value, inputDescription.value, onSubmit]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("department")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("department")} required />
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
