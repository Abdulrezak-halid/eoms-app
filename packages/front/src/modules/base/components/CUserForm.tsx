import { PASSWORD_REGEX } from "common";
import { useCallback } from "react";

import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputEmail } from "@m/core/components/CInputEmail";
import { CInputPassword } from "@m/core/components/CInputPassword";
import { CInputPhone } from "@m/core/components/CInputPhone";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoUserRequest, IDtoUserResponse } from "../interfaces/IDtoUser";
import { CFormFooterSaveUpdate } from "./CFormFooterSaveUpdate";

export function CUserForm({
  initialData,
  onSubmit,
}: {
  initialData?: IDtoUserResponse;
  onSubmit: (data: IDtoUserRequest) => Promise<void>;
}) {
  const { t } = useTranslation();

  const isCreating = !initialData;

  const passwordLabel = isCreating ? t("password") : t("changePassword");

  const inputName = useInput(initialData?.name || "");
  const inputSurname = useInput(initialData?.surname || "");
  const inputPosition = useInput(initialData?.position || "");
  const inputPhone = useInput(initialData?.phone || "");
  const inputEmail = useInput(initialData?.email || "");
  const inputPassword = useInput("");

  const invalid = useInputInvalid(
    inputName,
    inputSurname,
    inputPosition,
    inputPhone,
    inputEmail,
    inputPassword,
  );

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    await onSubmit({
      name: inputName.value,
      surname: inputSurname.value || undefined,
      position: inputPosition.value || undefined,
      phone: inputPhone.value || undefined,
      email: inputEmail.value,
      password: inputPassword.value,
    });
  }, [
    invalid,
    onSubmit,
    inputName.value,
    inputSurname.value,
    inputPosition.value,
    inputPhone.value,
    inputEmail.value,
    inputPassword.value,
  ]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("name")} invalidMsg={inputName.invalidMsg}>
          <CInputString {...inputName} placeholder={t("name")} required />
        </CFormLine>

        <CFormLine label={t("surname")} invalidMsg={inputSurname.invalidMsg}>
          <CInputString {...inputSurname} placeholder={t("surname")} />
        </CFormLine>

        <CFormLine label={t("position")} invalidMsg={inputPosition.invalidMsg}>
          <CInputString {...inputPosition} placeholder={t("position")} />
        </CFormLine>

        <CFormLine label={t("phone")} invalidMsg={inputPhone.invalidMsg}>
          <CInputPhone {...inputPhone} placeholder={t("phone")} />
        </CFormLine>

        <CFormLine label={t("email")} invalidMsg={inputEmail.invalidMsg}>
          <CInputEmail {...inputEmail} placeholder={t("email")} required />
        </CFormLine>

        <CFormLine
          label={passwordLabel}
          invalidMsg={inputPassword.invalidMsg}
          description={!isCreating ? t("newPasswordDescription") : undefined}
        >
          <CInputPassword
            {...inputPassword}
            placeholder={passwordLabel}
            required={isCreating}
            regex={PASSWORD_REGEX}
            regexInvalidMsg={t("invalidPassword")}
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
