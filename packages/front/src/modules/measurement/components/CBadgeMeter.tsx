import { CircleGauge } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeMeter({ value }: { value: string }) {
  return <CBadge icon={CircleGauge} value={value} />;
}
