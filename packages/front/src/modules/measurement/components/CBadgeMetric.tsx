import { Gauge } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeMetric({
  value,
  wrap,
}: {
  value: string;
  wrap?: boolean;
}) {
  return <CBadge icon={Gauge} value={value} wrap={wrap} />;
}
