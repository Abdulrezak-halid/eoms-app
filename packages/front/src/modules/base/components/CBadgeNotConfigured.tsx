import { CircleX } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CBadgeNotConfigured() {
  const { t } = useTranslation();
  return (
    <CBadge
      className="text-red-700 dark:text-red-300"
      icon={CircleX}
      value={t("notConfigured")}
    />
  );
}
