import { Phone } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgePhone({ value }: { value: string }) {
  return (
    <CBadge
      className="text-gray-600 dark:text-gray-300"
      icon={Phone}
      value={value}
    />
  );
}
