import { CircleCheck, CircleX } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";

const statusConfig = {
  YES: {
    icon: CircleCheck,
    className: "text-green-700 dark:text-green-300",
  },
  NO: {
    icon: CircleX,
    className: "text-red-700 dark:text-red-300",
  },
};

export function CBadgeYesNo({ value }: { value: boolean }) {
  const { t } = useTranslation();

  const config = statusConfig[value ? "YES" : "NO"];

  return (
    <CBadge
      className={config.className}
      icon={config.icon}
      value={value ? t("yes") : t("no")}
    />
  );
}
