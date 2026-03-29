import { CircleGauge } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeSeu({ value, wrap }: { value: string; wrap?: boolean }) {
  return <CBadge icon={CircleGauge} value={value} wrap={wrap} />;
}
