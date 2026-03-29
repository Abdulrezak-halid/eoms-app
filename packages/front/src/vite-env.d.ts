/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_BUILD_ID?: string;
  readonly VITE_ENV_NAME: string;
  readonly VITE_API_URL: string;
  readonly VITE_HCAPTCHA_SITEKEY?: string;

  readonly VITE_DEV_PAGES?: "true";
  readonly VITE_NO_LOGIN?: "true";
  readonly VITE_DEMO?: "true";
  readonly VITE_BUILD_TIME?: string;

  readonly VITE_APP_TOLGEE_API_URL?: string;
  readonly VITE_APP_TOLGEE_API_KEY?: string;
  readonly VITE_APP_TOLGEE_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.md" {
  const value: string;
  export default value;
}
