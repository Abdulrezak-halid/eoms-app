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
