import { MemoryStick } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeAgent({ value }: { value: string }) {
  return <CBadge icon={MemoryStick} value={value} />;
}
