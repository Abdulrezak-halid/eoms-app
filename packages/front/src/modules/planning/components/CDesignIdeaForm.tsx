import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoDesignIdeaRequest,
  IDtoDesignIdeaResponse,
} from "../interfaces/IDtoDesign";

export function CDesignIdeaForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoDesignIdeaResponse;
  onSubmit: (data: IDtoDesignIdeaRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputNo = useInput(initialData?.no);
  const inputRisks = useInput(initialData?.risks);
  const inputReduction = useInput(initialData?.reduction);

  const invalid = useInputInvalid(
    inputName,
    inputNo,
    inputRisks,
    inputReduction,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputNo.value ||
      !inputRisks.value ||
      !inputReduction.value
    ) {
      return;
    }

    const body = {
      name: inputName.value,
      no: inputNo.value,
      risks: inputRisks.value,
      reduction: inputReduction.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputName.value,
    inputNo.value,
    inputRisks.value,
    inputReduction.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine label={t("numberShort")} invalidMsg={inputNo.invalidMsg}>
          <CInputString {...inputNo} placeholder={t("numberShort")} required />
        </CFormLine>

        <CFormLine label={t("risks")} invalidMsg={inputRisks.invalidMsg}>
          <CInputTextarea {...inputRisks} placeholder={t("risks")} required />
        </CFormLine>

        <CFormLine
          label={t("reduction")}
          invalidMsg={inputReduction.invalidMsg}
        >
          <CInputTextarea
            {...inputReduction}
            placeholder={t("reduction")}
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
