/**
 * @file: CBadgeMetricType.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 29.12.2025
 * Last Modified Date: 29.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEMetricType } from "common/build-api-schema";

import { CBadge } from "@m/core/components/CBadge";

import { useMetricTypeMap } from "../hooks/useMetricTypeMap";

export function CBadgeMetricType({ value }: { value: IDtoEMetricType }) {
  const map = useMetricTypeMap();

  const info = map[value];

  return <CBadge icon={info.icon} value={info.label} />;
}
