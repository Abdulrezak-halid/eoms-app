/**
 * @file: renderPlainOrTranslatableText.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoPlainOrTranslatableText } from "common/build-api-schema";

import { TranslationFunc } from "@m/core/hooks/useTranslation";

export function renderPlainOrTranslatableText(
  t: TranslationFunc,
  value: IDtoPlainOrTranslatableText | undefined,
): string {
  if (!value) {
    return "";
  }
  if (value.type === "PLAIN") {
    return value.value;
  }
  return t(value.value, {
    noWrap: true,
  });
}
