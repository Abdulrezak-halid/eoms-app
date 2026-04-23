import { User } from "lucide-react";
import { useEffect } from "react";

import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputPassword } from "@m/core/components/CInputPassword";
import { CInputString } from "@m/core/components/CInputString";
import { CInputUrl } from "@m/core/components/CInputUrl";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoOutboundIntegrationParamAvevaPi } from "../interfaces/IDtoOutboundIntegration";

export function COutboundIntegrationSubFormAvevaPi({
  value,
  onChange,
  onChangeInvalid,
}: {
  value?: IDtoOutboundIntegrationParamAvevaPi;
  onChange: (value: IDtoOutboundIntegrationParamAvevaPi) => void;
  onChangeInvalid: (isValid: boolean) => void;
}) {
  const { t } = useTranslation();

  const inputBaseUrl = useInput(value?.baseUrl || "");
  const inputUsername = useInput(value?.username || "");
  const inputPassword = useInput(value?.password || "");

  const invalid = useInputInvalid(inputBaseUrl, inputUsername, inputPassword);

  useEffect(() => {
    if (invalid) {
      onChangeInvalid(true);
      return;
    }

    onChange({
      baseUrl: inputBaseUrl.value,
      username: inputUsername.value,
      password: inputPassword.value,
    });

    onChangeInvalid(false);
  }, [
    inputBaseUrl.value,
    inputPassword.value,
    inputUsername.value,
    invalid,
    onChange,
    onChangeInvalid,
  ]);

  return (
    <CFormPanel>
      <CFormLine
        label={t("serviceUrl")}
        invalidMsg={inputBaseUrl.invalidMsg}
        info={t("msgOutboundIntegrationServiceUrlInfo")}
      >
        <CInputUrl {...inputBaseUrl} placeholder={t("serviceUrl")} required />
      </CFormLine>

      <CFormLine label={t("username")} invalidMsg={inputUsername.invalidMsg}>
        <CInputString
          icon={User}
          {...inputUsername}
          placeholder={t("username")}
          required
        />
      </CFormLine>

      <CFormLine label={t("password")} invalidMsg={inputPassword.invalidMsg}>
        <CInputPassword
          {...inputPassword}
          placeholder={t("password")}
          required
        />
      </CFormLine>
    </CFormPanel>
  );
}
