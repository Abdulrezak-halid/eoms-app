import { DefaultParamType, TranslationKey } from "@tolgee/web";

// export type II18n = Omit<TolgeeInstance, "t"> & {
//   t: (key: TranslationKey) => string;
// };

export type II18n = {
  t: (key: TranslationKey, params?: Record<string, DefaultParamType>) => string;
  getLanguage: () => string;
};
