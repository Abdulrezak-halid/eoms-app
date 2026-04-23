import { IDtoEMetricType } from "common/build-api-schema";

import { CBadge } from "@m/core/components/CBadge";

import { useMetricTypeMap } from "../hooks/useMetricTypeMap";

export function CBadgeMetricType({ value }: { value: IDtoEMetricType }) {
  const map = useMetricTypeMap();

  const info = map[value];

  return <CBadge icon={info.icon} value={info.label} />;
}
