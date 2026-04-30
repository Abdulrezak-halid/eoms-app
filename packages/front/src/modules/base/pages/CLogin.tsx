import HCaptcha from "@hcaptcha/react-hcaptcha";
import {
  EApiFailCode,
  EXAMPLE_USER_EMAIL,
  EXAMPLE_USER_PASSWORD,
} from "common";
import { CircleUser } from "lucide-react";
import { useCallback, useContext, useMemo, useRef, useState } from "react";

import logo from "@/assets/images/eoms-logo.horizontal.shadow.768x227.webp";

import { Api, generateRequestGetPath } from "@m/base/api/Api";
import { CDarkThemeSwitch } from "@m/base/components/CDarkThemeSwitch";
import { VERSION } from "@m/base/constants/Version";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CExternalLink } from "@m/core/components/CExternalLink";
import { CForm } from "@m/core/components/CForm";
import { CInputPassword } from "@m/core/components/CInputPassword";
import { CInputString } from "@m/core/components/CInputString";
import { CInvalidMsg } from "@m/core/components/CInvalidMsg";
import { ContextTheme } from "@m/core/contexts/ContextTheme";
import { ContextToast } from "@m/core/contexts/ContextToast";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CDisplayImage } from "../components/CDisplayImage";
import { CLanguageSelector } from "../components/CLanguageSelector";

export function CLogin() {
  const defaultValues = useMemo(() => {
    // Prefill login form on dev and preview environments
    // Same check at back/UtilEnv
    if (
      import.meta.env.VITE_ENV_NAME !== "alpha" &&
      import.meta.env.VITE_ENV_NAME !== "beta" &&
      import.meta.env.VITE_ENV_NAME !== "staging" &&
      import.meta.env.VITE_ENV_NAME !== "prod"
    ) {
      return {
        email: EXAMPLE_USER_EMAIL,
        password: EXAMPLE_USER_PASSWORD,
      };
    }

    return { email: "", password: "" };
  }, []);

  const inputEmail = useInput(defaultValues.email);
  const inputPassword = useInput(defaultValues.password);

  const [token, setToken] = useState<string>();
  const captchaRef = useRef<HCaptcha | null>(null);

  const invalidForm = useInputInvalid(inputEmail, inputPassword);
  const invalidToken = Boolean(import.meta.env.VITE_HCAPTCHA_SITEKEY) && !token;
  const invalid =
    invalidForm || !inputEmail.value || !inputPassword.value || invalidToken;

  const [errorMsg, setErrorMsg] = useState("");

  const { t } = useTranslation();

  const { push } = useContext(ContextToast);
  const { publicOrganizationInfo, setSession } = useContext(ContextSession);

  const handleCaptchaLoad = useCallback(() => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current?.execute();
  }, []);

  const handleSubmit = useCallback(async () => {
    setErrorMsg("");
    if (invalid) {
      return;
    }
    const res = await Api.POST("/g/login", {
      body: {
        email: inputEmail.value,
        password: inputPassword.value,
        token: import.meta.env.VITE_HCAPTCHA_SITEKEY ? token || "" : "DUMMY",
      },
    });
    if (res.data) {
      push(t("loggedInSuccessfully"), "success");
      setSession(res.data);
      return;
    }
    const error = res.error;
    if (error === EApiFailCode.INVALID_TOKEN) {
      setErrorMsg(t("msgLoginInvalidToken"));
      setToken(undefined);
      captchaRef.current?.resetCaptcha();
      return;
    }
    if (error === EApiFailCode.BAD_REQUEST) {
      setErrorMsg(t("emailOrPasswordIsWrong"));
      setToken(undefined);
      captchaRef.current?.resetCaptcha();
      return;
    }

    if (error === EApiFailCode.MAINTENANCE) {
      setErrorMsg(t("msgServerMaintenance"));
      return;
    }
    setErrorMsg(t("somethingWentWrong"));
  }, [inputEmail, inputPassword, token, push, setSession, invalid, t]);

  const { dark } = useContext(ContextTheme);

  const year = useMemo(() => new Date().getFullYear(), []);

  const bannerUrl = useMemo(
    () =>
      publicOrganizationInfo?.hasBanner
        ? generateRequestGetPath("/g/organization-banner", {})
        : undefined,
    [publicOrganizationInfo?.hasBanner],
  );

  return (
    <div className="h-full flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-900 px-3">
      <CForm onSubmit={handleSubmit} className="w-[21rem]">
        <CCard className="p-4 space-y-4">
          {publicOrganizationInfo && bannerUrl ? (
            <div className="text-center space-y-1">
              <div className="font-bold text-xl text-gray-600 dark:text-gray-300">
                {publicOrganizationInfo.displayName}
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 p-2 h-20 rounded-lg flex justify-center items-center">
                <CDisplayImage
                  className="max-w-full max-h-full"
                  src={bannerUrl}
                  alt={publicOrganizationInfo.displayName}
                />
              </div>
            </div>
          ) : (
            <img
              className="w-[16rem] mx-auto"
              src={logo}
              alt={import.meta.env.VITE_APP_NAME}
            />
          )}

          <CInputString
            icon={CircleUser}
            placeholder={t("email")}
            {...inputEmail}
            noCleanButton
          />

          <div>
            <CInputPassword
              placeholder={t("password")}
              {...inputPassword}
              noCleanButton
            />
            <CInvalidMsg value={errorMsg} />
          </div>

          {import.meta.env.VITE_HCAPTCHA_SITEKEY && (
            <div className="flex justify-center">
              <HCaptcha
                sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY}
                onLoad={handleCaptchaLoad}
                onVerify={setToken}
                ref={captchaRef}
                theme={dark ? "dark" : "light"}
              />
            </div>
          )}

          <div className="flex justify-end">
            <CButton label={t("login")} primary disabled={invalid} submit />
          </div>
        </CCard>
      </CForm>

      {import.meta.env.VITE_DEV_PAGES && (
        <CCard className="justify-center items-center mt-4 p-2">
          <CExternalLink
            label="API Doc"
            href={`${import.meta.env.VITE_API_URL}/ui`}
            tertiary
          />
          {/* <CExternalLink
            label="Dev Report"
            href={`${import.meta.env.VITE_API_URL}/g/dev/report/render`}
            tertiary
          /> */}
        </CCard>
      )}

      <div className="text-gray-400 mt-2 text-small leading-tight text-center">
        {import.meta.env.VITE_APP_NAME} - v{VERSION} - {year}
        {/* Hide env info on workspace domains */}
        {!publicOrganizationInfo && (
          <>
            <br />
            {import.meta.env.VITE_ENV_NAME}
            {import.meta.env.VITE_BUILD_ID &&
              ` - ${import.meta.env.VITE_BUILD_ID}`}
            {import.meta.env.VITE_BUILD_TIME && (
              <>
                <br />
                {import.meta.env.VITE_BUILD_TIME}
              </>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2 sm:absolute bottom-0 left-0 px-4 pb-2 pt-4">
        <CDarkThemeSwitch />
        <CLanguageSelector />
      </div>
    </div>
  );
}
