import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxUnitGroup } from "@m/base/components/CComboboxUnitGroup";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoProductRequest,
  IDtoProductResponse,
} from "../interfaces/IDtoProduct";

export function CProductForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoProductResponse;
  onSubmit: (data: IDtoProductRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputCode = useInput(initialData?.code);
  const inputUnit = useInput(initialData?.unit);
  const inputDescription = useInput(initialData?.description || "");

  const invalid = useInputInvalid(inputCode, inputUnit, inputDescription);

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputCode.value || !inputUnit.value) {
      return;
    }

    const body = {
      code: inputCode.value,
      unit: inputUnit.value,
      description: inputDescription.value || null,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputCode.value,
    inputUnit.value,
    inputDescription.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("code")} invalidMsg={inputCode.invalidMsg}>
          <CInputString {...inputCode} placeholder={t("code")} required />
        </CFormLine>

        <CFormLine label={t("unit")} invalidMsg={inputUnit.invalidMsg}>
          <CComboboxUnitGroup {...inputUnit} required />
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
