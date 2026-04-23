/**
 * @file: CBadgeMetricIntegrationPeriod.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 31.08.2025
 * Last Modified Date: 31.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEMetricIntegrationPeriod } from "common/build-api-schema";

import { CBadge } from "@m/core/components/CBadge";

import { useMetricIntegrationPeriodMap } from "../hooks/useMetricIntegrationPeriodMap";

export function CBadgeMetricIntegrationPeriod({
  value,
}: {
  value: IDtoEMetricIntegrationPeriod;
}) {
  const statusMap = useMetricIntegrationPeriodMap();

  const info = statusMap[value];

  return <CBadge icon={info.icon} value={statusMap[value].label} />;
}
