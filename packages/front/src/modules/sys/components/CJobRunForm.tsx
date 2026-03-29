import { useCallback, useState } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CComboboxJobHandler } from "@m/base/components/CComboboxJobHandler";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputJson } from "@m/core/components/CInputJson";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoJobListResponse,
  IDtoJobRunRequest,
} from "../interfaces/IDtoServiceJob";

export function CJobRunForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoJobListResponse;
  onSubmit: (data: IDtoJobRunRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.meta.name);

  const [valueParam, setValueParam] = useState<unknown>(
    () => initialData?.meta.param || {},
  );

  const invalid = useInputInvalid(inputName);

  const handleSubmit = useCallback(async () => {
    if (invalid || !inputName.value) {
      return;
    }

    const body = {
      name: inputName.value,
      param: valueParam,
    };

    await onSubmit(body);
  }, [invalid, inputName.value, valueParam, onSubmit]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CComboboxJobHandler {...inputName} required />
        </CFormLine>

        <CFormLine label={t("parameter")}>
          <CInputJson value={valueParam} onChange={setValueParam} />
        </CFormLine>

        <CFormFooterSaveUpdate
          isUpdate={Boolean(initialData)}
          disabled={invalid}
        />
      </CFormPanel>
    </CForm>
  );
}
