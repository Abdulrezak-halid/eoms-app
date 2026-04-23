import { WifiOff } from "lucide-react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMessageText } from "./CMessageText";

export function CTimeout({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <CMessageText
      className={className}
      icon={WifiOff}
      value={t("msgRequestTimeout")}
      type="warning"
    />
  );
}
