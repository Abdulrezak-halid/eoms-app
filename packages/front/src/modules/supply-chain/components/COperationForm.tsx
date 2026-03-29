import { useCallback } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoOperationResponse } from "../interfaces/IDtoPipeline";

export function COperationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoOperationResponse;
  onSubmit: (name: string) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);

  const invalid = useInputInvalid(inputName);

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputName.value) {
      return;
    }

    await onSubmit(inputName.value);
  }, [invalid, inputName.value, onSubmit]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
