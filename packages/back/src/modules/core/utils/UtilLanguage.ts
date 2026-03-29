import { DevBackend, FormatSimple, Tolgee } from "@tolgee/web";

import { IContextCore } from "../interfaces/IContext";
import { II18n } from "../interfaces/II18n";

export namespace UtilLanguage {
  export async function create(c: IContextCore, languages?: string) {
    const instance = Tolgee();

    if (c.env.TOLGEE_API_KEY) {
      instance.use(DevBackend());
    }

    instance.use(FormatSimple());

    const tolgee = instance.init({
      language: languages ? languages.split(",")[0] : "en",
      fallbackLanguage: "en",

      // For development
      apiUrl: c.env.TOLGEE_API_URL,
      apiKey: c.env.TOLGEE_API_KEY,
      // Project id is for personal access tokens.
      // For project tokens, no need to set proejct id.
      projectId: c.env.TOLGEE_PROJECT_ID,

      // For production
      // Do not remove CI-LANG-LINE, it is used by CI/CD scripts
      staticData: {
        // CI-LANG-LINE
        // en: () => import("./assets/locales/en.json"),
      },
    });

    await tolgee.loadRequired();

    return tolgee as II18n;
  }
}
