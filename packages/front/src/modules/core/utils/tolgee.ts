import { FormatSimple, Tolgee } from "@tolgee/react";
import { InContextTools } from "@tolgee/web/tools";

import { LOCAL_STORAGE_KEY_LANGUAGE } from "@m/base/constants/LocalStorageKeys";

export const tolgeeInstance = Tolgee();

if (import.meta.env.VITE_APP_TOLGEE_API_KEY) {
  tolgeeInstance.use(InContextTools());
}

tolgeeInstance.use(FormatSimple());

export const tolgee = tolgeeInstance.init({
  language: window.localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE) || "en",

  // For development
  apiUrl: import.meta.env.VITE_APP_TOLGEE_API_URL,
  apiKey: import.meta.env.VITE_APP_TOLGEE_API_KEY,
  // Project id is for personal access tokens.
  // For project tokens, no need to set proejct id.
  projectId: import.meta.env.VITE_APP_TOLGEE_PROJECT_ID,

  // For production
  // Do not remove CI-LANG-LINE, it is used by CI/CD scripts
  staticData: {
    // CI-LANG-LINE
    // en: () => import("./assets/locales/en.json"),
  },
});
