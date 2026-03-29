/**
 * @file: CBadgeEnabled.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.08.2025
 * Last Modified Date: 18.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { CircleCheck, CircleX } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";

const statusConfig = {
  ENABLED: {
    icon: CircleCheck,
    className: "text-green-700 dark:text-green-300",
  },
  DISABLED: {
    icon: CircleX,
    className: "",
  },
};

export function CBadgeEnabled({ value }: { value: boolean }) {
  const { t } = useTranslation();

  const config = statusConfig[value ? "ENABLED" : "DISABLED"];

  return (
    <CBadge
      className={config.className}
      icon={config.icon}
      value={value ? t("enabled") : t("disabled")}
    />
  );
}
