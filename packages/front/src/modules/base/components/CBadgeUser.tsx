import { User } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeUser({ value, wrap }: { value: string; wrap?: boolean }) {
  return <CBadge icon={User} value={value} wrap={wrap} />;
}
