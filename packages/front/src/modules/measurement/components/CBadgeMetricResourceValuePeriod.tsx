import { IDtoEMetricResourceValuePeriod } from "common/build-api-schema";

import { CBadge } from "@m/core/components/CBadge";

import { useMetricResourceValuePeriodMap } from "../hooks/useMetricResourceValuePeriodMap";

export function CBadgeMetricResourceValuePeriod({
  value,
}: {
  value: IDtoEMetricResourceValuePeriod;
}) {
  const statusMap = useMetricResourceValuePeriodMap();

  const info = statusMap[value];

  return <CBadge icon={info.icon} value={statusMap[value].label} />;
}
