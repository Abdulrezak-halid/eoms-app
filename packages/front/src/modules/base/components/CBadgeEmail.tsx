import { Mail } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";

export function CBadgeEmail({ value }: { value: string }) {
  return (
    <CBadge
      className="text-gray-600 dark:text-gray-300"
      icon={Mail}
      value={value}
    />
  );
}
