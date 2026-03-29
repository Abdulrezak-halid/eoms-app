import { useTranslate } from "@tolgee/react";

export function useTranslation() {
  return useTranslate();
}

export type TranslationFunc = ReturnType<typeof useTranslation>["t"];
