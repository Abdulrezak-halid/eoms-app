import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputUrl } from "@m/core/components/CInputUrl";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

import {
  IDtoQdmsIntegrationRequest,
  IDtoQdmsIntegrationResponse,
} from "../interfaces/IDtoQdmsIntegration";
import { CComboboxQdmsIntegrationBindingPage } from "./CComboboxQdmsIntegrationBindingPage";

export function CQdmsIntegrationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoQdmsIntegrationResponse;
  onSubmit: (data: IDtoQdmsIntegrationRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputBindingPage = useInput(initialData?.bindingPage);
  const inputEndpointUrl = useInput(initialData?.endpointUrl);

  const invalid = useInputInvalid(
    inputName,
    inputBindingPage,
    inputEndpointUrl,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputBindingPage.value ||
      !inputEndpointUrl.value
    ) {
      return;
    }
    const body = {
      name: inputName.value,
      bindingPage: inputBindingPage.value,
      endpointUrl: inputEndpointUrl.value,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputName.value,
    inputBindingPage.value,
    inputEndpointUrl.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine
          label={t("bindingPage")}
          invalidMsg={inputBindingPage.invalidMsg}
        >
          <CComboboxQdmsIntegrationBindingPage {...inputBindingPage} required />
        </CFormLine>

        <CFormLine
          label={t("endpointUrl")}
          invalidMsg={inputEndpointUrl.invalidMsg}
        >
          <CInputUrl
            {...inputEndpointUrl}
            placeholder={t("endpointUrl")}
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
