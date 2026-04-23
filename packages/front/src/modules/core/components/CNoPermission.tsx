import { useTranslation } from "@m/core/hooks/useTranslation";
import { Ban } from "lucide-react";

import { CMessageText } from "./CMessageText";

export function CNoPermission({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CMessageText
      className={className}
      icon={Ban}
      value={t("youDontHavePermissionToSeeThisPage")}
      type="warning"
    />
  );
}
