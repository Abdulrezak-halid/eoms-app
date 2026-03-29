/**
 * @file: CBadgeAgent.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.08.2025
 * Last Modified Date: 01.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { MemoryStick } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeAgent({ value }: { value: string }) {
  return <CBadge icon={MemoryStick} value={value} />;
}
