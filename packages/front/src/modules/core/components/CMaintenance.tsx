import { useTranslation } from "@m/core/hooks/useTranslation";
import { Construction } from "lucide-react";

import { CMessageText } from "./CMessageText";

export function CMaintenance({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CMessageText
      className={className}
      icon={Construction}
      value={t("msgServerMaintenance")}
      type="warning"
    />
  );
}
