import { Link } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeUrl({ value }: { value: string }) {
  return <CBadge icon={Link} value={value} />;
}
