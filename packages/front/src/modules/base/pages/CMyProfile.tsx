import { PASSWORD_REGEX } from "common";
import { CircleUser, Mail } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CIcon } from "@m/core/components/CIcon";
import { CInputPassword } from "@m/core/components/CInputPassword";
import { CLine } from "@m/core/components/CLine";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useInput } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IBreadCrumb } from "../components/CBreadCrumbs";
import { CLanguageSelector } from "../components/CLanguageSelector";

export function CMyProfile() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("myProfile") }],
    [t],
  );

  const inputPassword = useInput("");
  const invalidPassword = Boolean(
    inputPassword.invalidMsg || !inputPassword.value,
  );
  const apiToast = useApiToast();
  const { push } = useContext(ContextAreYouSure);
  const { clearSession } = useContext(ContextSession);
  const handleSubmitPassword = useCallback(async () => {
    await push(t("msgChangePassword"), async () => {
      if (invalidPassword) {
        return;
      }
      const res = await Api.POST("/u/profile/password", {
        body: { password: inputPassword.value },
      });
      apiToast(res);
      if (res.error === undefined) {
        inputPassword.onChange("");
        clearSession();
      }
    });
  }, [inputPassword, invalidPassword, apiToast, push, t, clearSession]);

  const contextSession = useContext(ContextSession);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CFormPanel>
        <CFormLine label={t("displayName")}>
          <CCard className="p-3">
            <CLine className="space-x-3">
              <CIcon value={CircleUser} />
              <div>{contextSession.session.userDisplayName}</div>
            </CLine>
          </CCard>
        </CFormLine>

        <CFormLine label={t("email")}>
          <CCard className="p-3">
            <CLine className="space-x-3">
              <CIcon value={Mail} />
              <div>{contextSession.session.userEmail}</div>
            </CLine>
          </CCard>
        </CFormLine>

        <CForm onSubmit={handleSubmitPassword}>
          <CFormLine
            label={t("changePassword")}
            invalidMsg={inputPassword.invalidMsg}
          >
            <CLine className="space-x-2">
              <CInputPassword
                placeholder={t("newPassword")}
                {...inputPassword}
                className="grow"
                regex={PASSWORD_REGEX}
                regexInvalidMsg={t("invalidPassword")}
              />
              <CButton
                primary
                submit
                label={t("save")}
                disabled={invalidPassword}
              />
            </CLine>
          </CFormLine>
        </CForm>

        <CFormLine label={t("language")}>
          <CLanguageSelector inputMode />
        </CFormLine>
      </CFormPanel>
    </CBody>
  );
}
