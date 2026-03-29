import { Building } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeDepartment({
  value,
  wrap,
}: {
  value: string;
  wrap?: boolean;
}) {
  return <CBadge icon={Building} value={value} wrap={wrap} />;
}
