import { FileText } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeFile({ value }: { value: string }) {
  return <CBadge icon={FileText} value={value} />;
}
