import { useCallback } from "react";

import { CComboboxPeriod } from "@m/base/components/CComboboxPeriod";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoEnergyPolicyRequest,
  IDtoEnergyPolicyResponse,
} from "../interfaces/IDtoEnergyPolicy";

export function CEnergyPolicyForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoEnergyPolicyResponse;
  onSubmit: (data: IDtoEnergyPolicyRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputContent = useInput(initialData?.content);
  const inputType = useInput(initialData?.type || ""); // nullable
  const inputTarget = useInput(initialData?.target || ""); // nullable
  const inputPeriod = useInput(initialData?.period);

  const invalid = useInputInvalid(
    inputContent,
    inputType,
    inputTarget,
    inputPeriod,
  );

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputContent.value || !inputPeriod.value) {
      return;
    }

    const body = {
      content: inputContent.value,
      type: inputType.value || null,
      target: inputTarget.value || null,
      period: inputPeriod.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputContent.value,
    inputPeriod,
    inputType.value,
    inputTarget.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("content")} invalidMsg={inputContent.invalidMsg}>
          <CInputTextarea
            {...inputContent}
            placeholder={t("content")}
            required
          />
        </CFormLine>

        <CFormLine label={t("type")} invalidMsg={inputType.invalidMsg}>
          <CInputString {...inputType} placeholder={t("type")} />
        </CFormLine>

        <CFormLine label={t("target")} invalidMsg={inputTarget.invalidMsg}>
          <CInputString {...inputTarget} placeholder={t("target")} />
        </CFormLine>

        <CFormLine label={t("period")} invalidMsg={inputPeriod.invalidMsg}>
          <CComboboxPeriod {...inputPeriod} required />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
