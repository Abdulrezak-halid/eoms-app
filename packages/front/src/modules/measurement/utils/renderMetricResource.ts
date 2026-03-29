/**
 * @file: renderMetricResource.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.12.2025
 * Last Modified Date: 27.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoMetricResource } from "common/build-api-schema";

import { TranslationFunc } from "@m/core/hooks/useTranslation";

import { renderMetricResourceLabel } from "./renderMetricResourceLabel";

export function renderMetricResource(
  t: TranslationFunc,
  value: IDtoMetricResource,
  withMetricName?: boolean,
) {
  const labels = value.labels
    .map((label) => renderMetricResourceLabel(t, label))
    .filter(Boolean)
    .join(", ");

  return withMetricName ? `${value.metric.name} (${labels})` : labels;
}
