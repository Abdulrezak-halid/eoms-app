import type en from "@/locales/en.json";

// This is for strict translation key check, and only works when static content
//   is available (see common/scripts/integrate-static-translations.sh script)

// declare module "@tolgee/core/lib/types" {
declare module "@tolgee/web" {
  type TranslationsType = typeof en;

  // ensures that nested keys are accessible with "."
  type DotNotationEntries<T> = T extends object
    ? {
        [K in keyof T]: `${K & string}${T[K] extends undefined
          ? ""
          : T[K] extends object
            ? `.${DotNotationEntries<T[K]>}`
            : ""}`;
      }[keyof T]
    : "";

  // enables both intellisense and new keys without an error
  type LiteralUnion<LiteralType extends BaseType, BaseType extends Primitive> =
    | LiteralType
    | (BaseType & { _?: never });

  export type TranslationKey = DotNotationEntries<TranslationsType>;
}
