/**
 * @file: useTranslation.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 04.11.2025
 * Last Modified Date: 04.11.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useTranslate } from "@tolgee/react";

export function useTranslation() {
  return useTranslate();
}

export type TranslationFunc = ReturnType<typeof useTranslation>["t"];
