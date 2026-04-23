import { useCallback } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoAgentRegistrationRequest,
  IDtoAgentRegistrationResponse,
} from "../interfaces/IDtoAgentRegistration";
import { CComboboxOrganization } from "./CComboboxOrganization";

export function CAgentRegistrationForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoAgentRegistrationResponse;
  onSubmit: (data: IDtoAgentRegistrationRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputName = useInput(initialData?.name);
  const inputSerialNo = useInput(initialData?.serialNo);
  const inputAssignedOrgId = useInput(initialData?.assignedOrg.id);
  const inputDescription = useInput(initialData?.description || "");

  const invalid = useInputInvalid(
    inputName,
    inputSerialNo,
    inputAssignedOrgId,
    inputDescription,
  );

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      !inputName.value ||
      !inputSerialNo.value ||
      !inputAssignedOrgId.value
    ) {
      return;
    }

    const body = {
      name: inputName.value,
      serialNo: inputSerialNo.value,
      assignedOrgId: inputAssignedOrgId.value,
      description: inputDescription.value || null,
    };

    await onSubmit(body);
  }, [
    invalid,
    inputName.value,
    inputSerialNo.value,
    inputAssignedOrgId.value,
    inputDescription.value,
    onSubmit,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine label={t("serialNo")} invalidMsg={inputSerialNo.invalidMsg}>
          <CInputString
            {...inputSerialNo}
            placeholder={t("serialNo")}
            required
          />
        </CFormLine>

        <CFormLine
          label={t("sysOrganization")}
          invalidMsg={inputAssignedOrgId.invalidMsg}
        >
          <CComboboxOrganization {...inputAssignedOrgId} required />
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
